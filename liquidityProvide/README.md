## Run the test using ganache-cli
1) in requirements.txt you can keep track of dependencies that this project has .  
for installing all dependencies listed in requirements.txt :  
    + Acivate the virtual environment (vyperEnv is the name of this project virtual environment) :  
        - mac or linux -> `source vyperEnv/bin/activate`  
        - windows with WSL or git bash -> `source vyperEnv/Scripts/activate`  
        - CMD.exe in windows ->  `vyperEnv/Scripts/activate.bat`  

    + Install dependencies :
    ```
    pip install -r requirements.txt
    ```

2) Call command below to run ganache on the mainnet fork   
```
ganache-cli --fork https://mainnet.infura.io/v3/5bc20cad614a4604b5a4ee51e8023cb9 --unlock 0xda9ce944a37d218c3302f6b82a094844c6eceb17 --networkId 999
```
Now ganache is running on the mainnet fork 

3) Open a new terminal and call command below  
```
npx truffle test test/liquidity.js  --network mainnetFork
```
