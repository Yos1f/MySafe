import { Component, OnInit } from '@angular/core';
import { ethers } from 'ethers';
import { providers } from 'ethers';
declare let window: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  title: string = 'Safe Control Panel';
  v_balance = "n/a";
  v_locks = "n/a";
  v_safe: string = (localStorage.getItem("safe"));
  v_signers: string = (localStorage.getItem("signers"));
  v_signer: string;
  v_sbalance: string;
  v_with: string;
  v_solo: boolean;
  v_blocks: number;
  v_unlocksolo_returnedmessage: string;
  v_createSafe: string;
  v_unlock: string;
  v_reset: string;

  constructor() {
  }
  ngOnInit(): void { }

  async deploy(accounts: string, min: string, delay: string) {
    const accs = accounts.split(",");
    const signers = accs.length;
    let provider = new providers.Web3Provider(window.ethereum, "any");
    const signer = await provider.getSigner();
    let factory = new ethers.ContractFactory(abi.abi, abi.bytecode, signer);
    try {
      const safe = await factory.deploy(parseInt(min), accs, parseInt(delay));
      localStorage.setItem('safe', safe.address);
      localStorage.setItem('signers', accounts);
      this.v_safe = safe.address;
      } catch (e) {
      this.v_createSafe = JSON.parse(JSON.stringify(e)).error.message;
    }


  }
  async getSoloStatus() {
    let provider = new providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    let safeC = new ethers.Contract(this.v_safe, abi.abi, signer);
    let solo = await safeC['getSoloStatus']();
    this.v_solo = solo;
  }
  async refreshFields() {

  }
  async resetAllFields() {
    this.v_balance = "";
    this.v_locks = "";
    this.v_safe = (localStorage.getItem("safe"));
    this.v_signers = (localStorage.getItem("signers"));
    this.v_sbalance = "";
    this.v_with = "";
    this.v_solo = null;
    this.v_blocks = null;
    this.v_signer = "";
    this.v_unlocksolo_returnedmessage = "";
    this.v_createSafe = "";
    this.v_unlock = "";
    this.v_reset = "";
  }
  async getBlocksToUnlock() {
    let blocks;
    let provider = new providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    let safeC = new ethers.Contract(this.v_safe, abi.abi, signer);
    try {
      blocks = await safeC['getBlocksToUnlock']();
      this.v_blocks=blocks;
    } catch (e) {
      this.v_blocks = JSON.parse(JSON.stringify(e)).error.message;
    }
    // this.v_blocks = blocks;
  }
  async getBalance() {
    let bal;
    let provider = new providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    let safeC = new ethers.Contract(this.v_safe, abi.abi, signer);
    bal = await safeC['getBalance']();
    bal = ethers.utils.formatEther(bal)
    this.v_balance = bal;
    this.v_signer = await signer.getAddress();
    let dummyX = await signer.getBalance();
    this.v_sbalance = ethers.utils.formatEther(dummyX);

    // this.v_signer = signer.address[0].toString();
  }
  async getCSigners() {
    let locks;
    let provider = new providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    let safeC = new ethers.Contract(this.v_safe, abi.abi, signer);
    this.v_signer = await signer.getAddress();
    locks = await safeC['getCurrentActiveSigners']();
    this.v_locks = locks;
  }
  async deposit() {
    let provider = new providers.Web3Provider(window.ethereum, "any");
    const options = { value: ethers.utils.parseEther("0.001") }
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    let safeC = new ethers.Contract(this.v_safe, abi.abi, signer);
    this.v_signer = await signer.getAddress();
    const deposit = await safeC['deposit'](options);
  }
  async unlock() {
    let provider = new providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    let safeC = new ethers.Contract(this.v_safe, abi.abi, signer);
    this.v_signer = await signer.getAddress();
    try {
      let unlock = await safeC['unLock']();
    } catch (e) {
      this.v_unlock = JSON.parse(JSON.stringify(e)).error.message
    }
  }
  async unlockSolo() {
    let provider = new providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    let safeC = new ethers.Contract(this.v_safe, abi.abi, signer);
    this.v_signer = await signer.getAddress();
    try {
      let getSolo = await safeC['unlockSolo']();
      this.v_unlocksolo_returnedmessage = "Success";
    } catch(e) {
      this.v_unlocksolo_returnedmessage = JSON.parse(JSON.stringify(e)).error.message
    }
    
  }
  async resetSafe() {
    let provider = new providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    let safeC = new ethers.Contract(this.v_safe, abi.abi, signer);
    this.v_signer = await signer.getAddress();
    try {
         let reset = await safeC['resetSafe']();
    } catch (e) {
      this.v_reset = JSON.parse(JSON.stringify(e)).error.message
    }
  }

  async withdraw() {
    let provider = new providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    let safeC = new ethers.Contract(this.v_safe, abi.abi, signer);
    this.v_signer = await signer.getAddress();
    let withd;
    try {
      withd = await safeC['transferAmount'](signer.getAddress(), ethers.utils.parseEther("0.001"));
      this.v_with = "Success";
    } catch (e) {
      this.v_with = JSON.parse(JSON.stringify(e)).error.message
    }
  }
}

let contractAddress;

async function main() {
  let gSafe = await (localStorage.getItem("safe"));
  if (gSafe) {
    contractAddress = gSafe;
  } else {
    contractAddress = "N/A";
  }
}

let abi = {
  "_format": "hh-sol-artifact-1",
  "contractName": "Safe",
  "sourceName": "contracts/Safe.sol",
  "abi": [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "p_minSigners",
          "type": "uint256"
        },
        {
          "internalType": "address[]",
          "name": "p_accounts",
          "type": "address[]"
        },
        {
          "internalType": "uint256",
          "name": "p_blockToUnlock",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "inputs": [],
      "name": "deposit",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getBlocksToUnlock",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getCurrentActiveSigners",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getSoloStatus",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTotalSigners",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getuBlocks",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "resetSafe",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "s_accounts",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "_recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "transferAmount",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "unLock",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "unlockSolo",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ],
  "bytecode": "0x6080604052600080556001805560006002556000600560006101000a81548160ff0219169083151502179055503480156200003957600080fd5b50604051620016513803806200165183398181016040528101906200005f919062000605565b600a825110620000a6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016200009d90620006e1565b60405180910390fd5b82825111620000ec576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620000e39062000753565b60405180910390fd5b6000600180819055508160008190555083600381905550600090505b8251811015620001fe576000601060008584815181106200012e576200012d62000775565b5b602002602001015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508281815181106200018a576200018962000775565b5b6020026020010151600682600a8110620001a957620001a862000775565b5b0160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508080620001f590620007d3565b91505062000108565b80600481905550620002156200021f60201b60201c565b50505050620008f0565b6200022f6200033260201b60201c565b62000271576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620002689062000871565b60405180910390fd5b600060028190555060005b6004548110156200032f5760106000600683600a8110620002a257620002a162000775565b5b0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546002600082825462000312919062000893565b9250508190555080806200032690620007d3565b9150506200027c565b50565b600080600090505b600454811015620003d357600681600a81106200035c576200035b62000775565b5b0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415620003bd576001915050620003d9565b8080620003ca90620007d3565b9150506200033a565b50600090505b90565b6000604051905090565b600080fd5b600080fd5b6000819050919050565b6200040581620003f0565b81146200041157600080fd5b50565b6000815190506200042581620003fa565b92915050565b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6200047b8262000430565b810181811067ffffffffffffffff821117156200049d576200049c62000441565b5b80604052505050565b6000620004b2620003dc565b9050620004c0828262000470565b919050565b600067ffffffffffffffff821115620004e357620004e262000441565b5b602082029050602081019050919050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006200052682620004f9565b9050919050565b620005388162000519565b81146200054457600080fd5b50565b60008151905062000558816200052d565b92915050565b6000620005756200056f84620004c5565b620004a6565b905080838252602082019050602084028301858111156200059b576200059a620004f4565b5b835b81811015620005c85780620005b3888262000547565b8452602084019350506020810190506200059d565b5050509392505050565b600082601f830112620005ea57620005e96200042b565b5b8151620005fc8482602086016200055e565b91505092915050565b600080600060608486031215620006215762000620620003e6565b5b6000620006318682870162000414565b935050602084015167ffffffffffffffff811115620006555762000654620003eb565b5b6200066386828701620005d2565b9250506040620006768682870162000414565b9150509250925092565b600082825260208201905092915050565b7f4d617820313020735f6163636f756e7473416464726573736573000000000000600082015250565b6000620006c9601a8362000680565b9150620006d68262000691565b602082019050919050565b60006020820190508181036000830152620006fc81620006ba565b9050919050565b7f4d696e205369676e657273203e205369676e6572730000000000000000000000600082015250565b60006200073b60158362000680565b9150620007488262000703565b602082019050919050565b600060208201905081810360008301526200076e816200072c565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000620007e082620003f0565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415620008165762000815620007a4565b5b600182019050919050565b7f556e617574686f72697a6564206163636f756e74000000000000000000000000600082015250565b60006200085960148362000680565b9150620008668262000821565b602082019050919050565b600060208201905081810360008301526200088c816200084a565b9050919050565b6000620008a082620003f0565b9150620008ad83620003f0565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115620008e557620008e4620007a4565b5b828201905092915050565b610d5180620009006000396000f3fe6080604052600436106100ab5760003560e01c8063c09ba56311610064578063c09ba563146101b6578063caddbc24146101f3578063d0e30db01461020a578063d4c0497014610214578063d7081e031461022b578063ed10e33c14610247576100b2565b8063068dd0d1146100b457806312065fe0146100df5780632cef71651461010a5780636792c78114610135578063a32b322914610160578063b753d0861461018b576100b2565b366100b257005b005b3480156100c057600080fd5b506100c961025e565b6040516100d6919061087a565b60405180910390f35b3480156100eb57600080fd5b506100f46102dc565b604051610101919061087a565b60405180910390f35b34801561011657600080fd5b5061011f6102e4565b60405161012c919061087a565b60405180910390f35b34801561014157600080fd5b5061014a6102ee565b60405161015791906108b0565b60405180910390f35b34801561016c57600080fd5b50610175610305565b604051610182919061087a565b60405180910390f35b34801561019757600080fd5b506101a061030f565b6040516101ad919061087a565b60405180910390f35b3480156101c257600080fd5b506101dd60048036038101906101d891906108fc565b610319565b6040516101ea919061096a565b60405180910390f35b3480156101ff57600080fd5b5061020861034f565b005b610212610456565b005b34801561022057600080fd5b50610229610458565b005b610245600480360381019061024091906109c3565b61052e565b005b34801561025357600080fd5b5061025c61062b565b005b600060011515600560009054906101000a900460ff161515146102b6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102ad90610a60565b60405180910390fd5b43600154106102d457436001546102cd9190610aaf565b90506102d9565b600090505b90565b600047905090565b6000600454905090565b6000600560009054906101000a900460ff16905090565b6000600254905090565b6000600154905090565b600681600a811061032957600080fd5b016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6103576106c1565b610396576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161038d90610b2f565b60405180910390fd5b60005b60045481101561043057600060106000600684600a81106103bd576103bc610b4f565b5b0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550808061042890610b7e565b915050610399565b506000600560006101000a81548160ff021916908315150217905550610454610762565b565b565b6104606106c1565b61049f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161049690610b2f565b60405180910390fd5b60001515600560009054906101000a900460ff161515146104f5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104ec90610c39565b60405180910390fd5b6001600560006101000a81548160ff0219169083151502179055504360005461051e9190610c59565b60018190555061052c610762565b565b6105366106c1565b610575576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161056c90610b2f565b60405180910390fd5b6003546002541015806105a15750436001541080156105a05750600560009054906101000a900460ff165b5b6105e0576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105d790610cfb565b60405180910390fd5b8173ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050158015610626573d6000803e3d6000fd5b505050565b6106336106c1565b610672576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161066990610b2f565b60405180910390fd5b6001601060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506106bf610762565b565b600080600090505b60045481101561075957600681600a81106106e7576106e6610b4f565b5b0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561074657600191505061075f565b808061075190610b7e565b9150506106c9565b50600090505b90565b61076a6106c1565b6107a9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107a090610b2f565b60405180910390fd5b600060028190555060005b60045481101561085e5760106000600683600a81106107d6576107d5610b4f565b5b0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054600260008282546108449190610c59565b92505081905550808061085690610b7e565b9150506107b4565b50565b6000819050919050565b61087481610861565b82525050565b600060208201905061088f600083018461086b565b92915050565b60008115159050919050565b6108aa81610895565b82525050565b60006020820190506108c560008301846108a1565b92915050565b600080fd5b6108d981610861565b81146108e457600080fd5b50565b6000813590506108f6816108d0565b92915050565b600060208284031215610912576109116108cb565b5b6000610920848285016108e7565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061095482610929565b9050919050565b61096481610949565b82525050565b600060208201905061097f600083018461095b565b92915050565b600061099082610929565b9050919050565b6109a081610985565b81146109ab57600080fd5b50565b6000813590506109bd81610997565b92915050565b600080604083850312156109da576109d96108cb565b5b60006109e8858286016109ae565b92505060206109f9858286016108e7565b9150509250929050565b600082825260208201905092915050565b7f536f6c6f20756e6c6f636b206e6f742061637469766174656400000000000000600082015250565b6000610a4a601983610a03565b9150610a5582610a14565b602082019050919050565b60006020820190508181036000830152610a7981610a3d565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610aba82610861565b9150610ac583610861565b925082821015610ad857610ad7610a80565b5b828203905092915050565b7f556e617574686f72697a6564206163636f756e74000000000000000000000000600082015250565b6000610b19601483610a03565b9150610b2482610ae3565b602082019050919050565b60006020820190508181036000830152610b4881610b0c565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6000610b8982610861565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415610bbc57610bbb610a80565b5b600182019050919050565b7f53616665206973206a75737420696e207265717565737465642073746174652060008201527f28736f6c6f20556e6c6f636b6564290000000000000000000000000000000000602082015250565b6000610c23602f83610a03565b9150610c2e82610bc7565b604082019050919050565b60006020820190508181036000830152610c5281610c16565b9050919050565b6000610c6482610861565b9150610c6f83610861565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115610ca457610ca3610a80565b5b828201905092915050565b7f53616665206973204c6f636b6564000000000000000000000000000000000000600082015250565b6000610ce5600e83610a03565b9150610cf082610caf565b602082019050919050565b60006020820190508181036000830152610d1481610cd8565b905091905056fea2646970667358221220e1c0525ab18a8a799612483f4b974185482761a0b5f3a85b4cfd1627328afabe64736f6c63430008090033",
  "deployedBytecode": "0x6080604052600436106100ab5760003560e01c8063c09ba56311610064578063c09ba563146101b6578063caddbc24146101f3578063d0e30db01461020a578063d4c0497014610214578063d7081e031461022b578063ed10e33c14610247576100b2565b8063068dd0d1146100b457806312065fe0146100df5780632cef71651461010a5780636792c78114610135578063a32b322914610160578063b753d0861461018b576100b2565b366100b257005b005b3480156100c057600080fd5b506100c961025e565b6040516100d6919061087a565b60405180910390f35b3480156100eb57600080fd5b506100f46102dc565b604051610101919061087a565b60405180910390f35b34801561011657600080fd5b5061011f6102e4565b60405161012c919061087a565b60405180910390f35b34801561014157600080fd5b5061014a6102ee565b60405161015791906108b0565b60405180910390f35b34801561016c57600080fd5b50610175610305565b604051610182919061087a565b60405180910390f35b34801561019757600080fd5b506101a061030f565b6040516101ad919061087a565b60405180910390f35b3480156101c257600080fd5b506101dd60048036038101906101d891906108fc565b610319565b6040516101ea919061096a565b60405180910390f35b3480156101ff57600080fd5b5061020861034f565b005b610212610456565b005b34801561022057600080fd5b50610229610458565b005b610245600480360381019061024091906109c3565b61052e565b005b34801561025357600080fd5b5061025c61062b565b005b600060011515600560009054906101000a900460ff161515146102b6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102ad90610a60565b60405180910390fd5b43600154106102d457436001546102cd9190610aaf565b90506102d9565b600090505b90565b600047905090565b6000600454905090565b6000600560009054906101000a900460ff16905090565b6000600254905090565b6000600154905090565b600681600a811061032957600080fd5b016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6103576106c1565b610396576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161038d90610b2f565b60405180910390fd5b60005b60045481101561043057600060106000600684600a81106103bd576103bc610b4f565b5b0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550808061042890610b7e565b915050610399565b506000600560006101000a81548160ff021916908315150217905550610454610762565b565b565b6104606106c1565b61049f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161049690610b2f565b60405180910390fd5b60001515600560009054906101000a900460ff161515146104f5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104ec90610c39565b60405180910390fd5b6001600560006101000a81548160ff0219169083151502179055504360005461051e9190610c59565b60018190555061052c610762565b565b6105366106c1565b610575576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161056c90610b2f565b60405180910390fd5b6003546002541015806105a15750436001541080156105a05750600560009054906101000a900460ff165b5b6105e0576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105d790610cfb565b60405180910390fd5b8173ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050158015610626573d6000803e3d6000fd5b505050565b6106336106c1565b610672576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161066990610b2f565b60405180910390fd5b6001601060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506106bf610762565b565b600080600090505b60045481101561075957600681600a81106106e7576106e6610b4f565b5b0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561074657600191505061075f565b808061075190610b7e565b9150506106c9565b50600090505b90565b61076a6106c1565b6107a9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107a090610b2f565b60405180910390fd5b600060028190555060005b60045481101561085e5760106000600683600a81106107d6576107d5610b4f565b5b0160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054600260008282546108449190610c59565b92505081905550808061085690610b7e565b9150506107b4565b50565b6000819050919050565b61087481610861565b82525050565b600060208201905061088f600083018461086b565b92915050565b60008115159050919050565b6108aa81610895565b82525050565b60006020820190506108c560008301846108a1565b92915050565b600080fd5b6108d981610861565b81146108e457600080fd5b50565b6000813590506108f6816108d0565b92915050565b600060208284031215610912576109116108cb565b5b6000610920848285016108e7565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061095482610929565b9050919050565b61096481610949565b82525050565b600060208201905061097f600083018461095b565b92915050565b600061099082610929565b9050919050565b6109a081610985565b81146109ab57600080fd5b50565b6000813590506109bd81610997565b92915050565b600080604083850312156109da576109d96108cb565b5b60006109e8858286016109ae565b92505060206109f9858286016108e7565b9150509250929050565b600082825260208201905092915050565b7f536f6c6f20756e6c6f636b206e6f742061637469766174656400000000000000600082015250565b6000610a4a601983610a03565b9150610a5582610a14565b602082019050919050565b60006020820190508181036000830152610a7981610a3d565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610aba82610861565b9150610ac583610861565b925082821015610ad857610ad7610a80565b5b828203905092915050565b7f556e617574686f72697a6564206163636f756e74000000000000000000000000600082015250565b6000610b19601483610a03565b9150610b2482610ae3565b602082019050919050565b60006020820190508181036000830152610b4881610b0c565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6000610b8982610861565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415610bbc57610bbb610a80565b5b600182019050919050565b7f53616665206973206a75737420696e207265717565737465642073746174652060008201527f28736f6c6f20556e6c6f636b6564290000000000000000000000000000000000602082015250565b6000610c23602f83610a03565b9150610c2e82610bc7565b604082019050919050565b60006020820190508181036000830152610c5281610c16565b9050919050565b6000610c6482610861565b9150610c6f83610861565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115610ca457610ca3610a80565b5b828201905092915050565b7f53616665206973204c6f636b6564000000000000000000000000000000000000600082015250565b6000610ce5600e83610a03565b9150610cf082610caf565b602082019050919050565b60006020820190508181036000830152610d1481610cd8565b905091905056fea2646970667358221220e1c0525ab18a8a799612483f4b974185482761a0b5f3a85b4cfd1627328afabe64736f6c63430008090033",
  "linkReferences": {},
  "deployedLinkReferences": {}
}