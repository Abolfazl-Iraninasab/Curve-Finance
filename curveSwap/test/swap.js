const { sendEther } = require("./util")

const IERC20 = artifacts.require("IERC20")
const swap = artifacts.require("swap")

contract("token swap", (accounts) => {

    const TOKEN_IN = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"       // USDC
    const TOKEN_IN_INDEX = 1
    const TOKEN_OUT = "0xdAC17F958D2ee523a2206206994597C13D831ec7"      // USDT
    const TOKEN_OUT_INDEX = 2
    const TOKEN_IN_AMOUNT = 100000000                                   // USDC decimals : 6 
    const WHALE = "0xda9ce944a37d218c3302f6b82a094844c6eceb17"          // a USDC whale 

    let swapContract
    let tokenIn
    let tokenOut
    before(async () => {
        tokenIn = await IERC20.at(TOKEN_IN) ;
        tokenOut = await IERC20.at(TOKEN_OUT) ;
        swapContract = await swap.new() ;

        // Send ETH to WHALE to be able to send transaction
        await sendEther(web3, accounts[0], WHALE, 1)

    })

    it("Send TOKEN_IN_AMOUNT to swapContract", async () => {

        // Notice that the balance of WHALE should be greater than TOKEN_IN_AMOUNT
        await tokenIn.transfer(swapContract.address, TOKEN_IN_AMOUNT, {
            from: WHALE,
        })

        balBefore = await tokenOut.balanceOf(swapContract.address) ;
        console.log(`----- WHALE USDT balance before swap => ${balBefore} -----`);
    })

    it("swap token" , async () => {
        await swapContract.swap(TOKEN_IN_INDEX, TOKEN_OUT_INDEX)

        balAfter = await tokenOut.balanceOf(swapContract.address) ;
        console.log(`----- WHALE USDT balance after swap => ${balAfter} -----`);
    })

})
