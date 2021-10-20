<template>
  <div id="app" class="container mt-5">
    <b-button v-if="!connected" @click="connect" variant="primary">Connect Wallet</b-button>
    <div v-else>
      <b-overlay :show="inTransaction" rounded="sm">
        <b-card title="Name Store Demo">
          <connection-info :balance="balance" :symbol="symbol" :currentChain="currentChain"></connection-info>

          <p>
            Current Name: 
              <code v-if="name">{{ name }}</code>
              <i v-else>empty</i>
          </p>

          <b-input v-model="inputName" placeholder="Fill in a new name."></b-input>
          <b-button class="mt-2" variant="primary" @click="setName">Change Name</b-button>
        </b-card>
      </b-overlay>
    </div>
    <b-alert :show="errorMessage.length > 0" variant="danger" class="mt-2">
      {{ errorMessage }}
    </b-alert>
  </div>
</template>

<script>
import {ethers} from 'ethers'
import config from './config'
import nameStoreABI from './abi/NameStore'
import ConnectionInfo from './components/ConnectionInfo'

export default {
  components: {ConnectionInfo},

  data() {
    return {
      provider: null,
      signer: null,
      account: null,
      balance: null,
      connected: false,
      currentChain: null,
      name: '',
      inputName: '',
      errorMessage: '',
      inTransaction: false,
    }
  },

  computed: {
    symbol: ()=>config.network.symbol,
  },

  mounted() {
    this.init()
  },

  methods: {
    init() {
      this.provider = new ethers.providers.JsonRpcProvider(config.network.rpc, {
        chainId: config.network.chainId,
        name: config.network.symbol,
      })

      // Detect when the chain is changed.
      window.ethereum.on('chainChanged', chainId => {
        if (this.connected) {
          console.log(`Chain changed to ${chainId}`)
          this.connect()
        }
      })

      // read the initial value
      this.readName()

      // Monitor changes in the value of the contract
      const contract = new ethers.Contract(config.nameStore, nameStoreABI, this.provider)
      contract.on('NameChanged', () => {
        this.readName()
      })

      // Monitor account switches...out of scope
      // window.ethereum.on('accountsChanged', function (accounts) {})
    },

    async connect() {
      this.connected = false
      
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      await provider.send("eth_requestAccounts", []);

      this.currentChain = (await provider.getNetwork()).chainId
      if (this.currentChain != config.network.chainId) {
          this.errorMessage = 'WRONG NETWORK - Use Ropsten'
          return
      }

      this.signer = await provider.getSigner()
      this.account = await this.signer.getAddress() 
      this.balance = await provider.getBalance(this.account)
      
      this.connected = true

      this.readName()
    },

    async readName() {
      if (!this.connected) 
        return

      const contract = new ethers.Contract(config.nameStore, nameStoreABI, this.provider) // just provider as its read only
      console.log(this.account)
      contract.readName(this.account).then(name => {
        this.name = name
      })
    },

    setName() {
      const contract = new ethers.Contract(config.nameStore, nameStoreABI, this.signer) // just provider as its read only
      this.errorMessage = ''
      this.inTransaction = true
      contract.setName(this.inputName)
        .then(() => {
          this.inTransaction = false
        }).catch(this._handleError)
    },

    _handleError(e) {
      this.errorMessage = e.message
      this.inTransaction = false
    }
  }
}
</script>