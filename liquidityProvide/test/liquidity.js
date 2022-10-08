const { sendEther } = require("./util")

const IERC20 = artifacts.require("IERC20")
const testLiquidityContract = artifacts.require("liquidity")

contract("testLiquidityContract", (accounts) => {

    const TOKEN = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"          // USDC  
    const TOKEN_INDEX = 1
    const TOKEN_AMOUNT = 100000000
    const WHALE = "0xda9ce944a37d218c3302f6b82a094844c6eceb17"          // a USDC whale

    let liquidityContract
    let token
    before(async () => {
        token = await IERC20.at(TOKEN)
        liquidityContract = await testLiquidityContract.new()

        // send ETH to WHALE to be able to send transactions
        await sendEther(web3, accounts[0], WHALE, 1)

        await token.transfer(liquidityContract.address, TOKEN_AMOUNT, {
            from: WHALE,
        })
    })

    it("add / remove liquidity ( withdraw 3 tokens )", async () => {
        // add liquidity
        await liquidityContract.addLiquidity()
        let portion = await liquidityContract.getPortion()

        console.log(`--- add liquidity ---`)
        console.log(`portion: ${portion}`)

        // remove liquidity
        await liquidityContract.removeLiquidity()
        let bals = await liquidityContract.getBalances()

        console.log(`--- balance after removing liquidity ---`)
        console.log(`DAI: ${bals[0]}`)
        console.log(`USDC: ${bals[1]}`)
        console.log(`USDT: ${bals[2]}`)
    })

    it("add / remove liquidity ( withdraw 1 token )", async () => {

        // add liquidity
        await liquidityContract.addLiquidity()
        portion = await liquidityContract.getPortion()

        console.log(`--- add liquidity ---`)
        console.log(`portion: ${portion}`)

        const calc = await liquidityContract.calcWithdrawOneCoin(TOKEN_INDEX)

        console.log(`--- calc withdraw one coin with 2 methods ---`)
        console.log(`calc_withdraw_one_coin: ${calc[0]}`)
        console.log(`portion * virtual price: ${calc[1]}`)

        // remove liquidity
        await liquidityContract.removeLiquidityOneCoin(TOKEN_INDEX)
        bals = await liquidityContract.getBalances()

        console.log(`--- balance after removing liquidity and get one coin ---`)
        console.log(`DAI: ${bals[0]}`)
        console.log(`USDC: ${bals[1]}`)
        console.log(`USDT: ${bals[2]}`)
    })

})
