# @version 0.2.4

from vyper.interfaces import ERC20

interface CurveToken:
  def balanceOf(account: address) -> uint256: view

interface StableSwap:
  def add_liquidity(amounts: uint256[3], min_lp: uint256): nonpayable
  def remove_liquidity(lp: uint256, min_amounts: uint256[3]): nonpayable
  def remove_liquidity_one_coin(lp: uint256, i: int128, min_amount: uint256): nonpayable
  def calc_withdraw_one_coin(lp: uint256, i: int128) -> uint256: view
  def get_virtual_price() -> uint256: view

# address of stable coins
USDC: constant(address) = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
DAI: constant(address) = 0x6B175474E89094C44Da98b954EedeAC495271d0F
USDT: constant(address) = 0xdAC17F958D2ee523a2206206994597C13D831ec7

SWAP: constant(address) = 0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7 # StableSwap 3Pool contract
LP: constant(address) = 0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490   # liquidity pool token


TOKENS: constant(address[3]) = [
  DAI,
  USDC,
  USDT
]


@internal
def _safeApprove(token: address, spender: address, amount: uint256):
  res: Bytes[32] = raw_call(
    token,
    concat(
        method_id("approve(address,uint256)"),
        convert(spender, bytes32),
        convert(amount, bytes32),
    ),
    max_outsize=32,
  )
  if len(res) > 0:
      assert convert(res, bool)


@external
def addLiquidity():
  tokens: address[3] = TOKENS
  balances: uint256[3] = [0, 0, 0]
  for i in range(3):
    balances[i] = ERC20(tokens[i]).balanceOf(self)
    if balances[i] > 0:
      # USDT does not return True
      # ERC20(tokens[i]).approve(SWAP, balances[i])
      self._safeApprove(tokens[i], SWAP, balances[i])
  StableSwap(SWAP).add_liquidity(balances, 1)


@external
@view
def getPortion() -> uint256:
  return CurveToken(LP).balanceOf(self)

# withdraw all 3 tokens 
@external
def removeLiquidity():

  # amount of LP tokens locked in this contract 
  portion: uint256 = CurveToken(LP).balanceOf(self)

  # minimum amount we expect to receive 
  minAmounts: uint256[3] = [0, 0, 0]
  StableSwap(SWAP).remove_liquidity(portion, minAmounts)


@external
@view
def calcWithdrawOneCoin(i: int128) -> (uint256, uint256):
  portion: uint256 = CurveToken(LP).balanceOf(self)

  # method1
  w: uint256 = StableSwap(SWAP).calc_withdraw_one_coin(portion, i)

  # method2 : calculate the value of stableCoin per portion by calling function below
  vp: uint256 = StableSwap(SWAP).get_virtual_price()
  
  # finally we should divide the value by (10 **18) because the returned value has 18 decimals
  return (w, vp * portion / 10 ** 18)

# withdraw only one token
@external
def removeLiquidityOneCoin(i: int128):
  portion: uint256 = CurveToken(LP).balanceOf(self)
  minAmount: uint256 = 1
  StableSwap(SWAP).remove_liquidity_one_coin(portion, i, 1)


@external
@view
def getBalances() -> uint256[3]:
  tokens: address[3] = TOKENS
  balances: uint256[3] = [0, 0, 0]
  for i in range(3):
    balances[i] = ERC20(tokens[i]).balanceOf(self)
  return balances