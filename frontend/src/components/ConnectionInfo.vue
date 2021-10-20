<template>
    <div>
        <b-alert show variant="success">
            <h4>You are connected to {{ chain }}!</h4>
            <p>
                Your balance is {{ balance | toEth | currency }} {{ symbol }}
            </p>
        </b-alert>
    </div>
</template>

<script>
import _ from 'lodash'
import {utils} from 'ethers'
import chains from '../chains'

export default {
    props: ['balance', 'symbol', 'currentChain'],

    computed: {
        chain() {
            const result = _.filter(chains, chain => {
                return chain.chainId == this.currentChain
            })
            if (result.length == 0) return 'Unknown Chain'
            return result[0].name
        }
    },

    filters: {
        toEth(amount, decimals = 18) {
            return utils.formatUnits(amount, decimals)
        },

        currency(amount) {
            return Intl.NumberFormat('en-us', {
                type: 'currency'
            }).format(amount)
        }
    }
}
</script>