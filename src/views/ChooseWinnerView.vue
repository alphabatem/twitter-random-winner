<template>
	<div class="container mt-5 text-center">
		<h1>Winner Selector</h1>

		<h2 v-if="loading">{{ loadingStatus }}</h2>

		<h1 v-if="winner">WINNER: <code>{{winner}}</code></h1>

		<div class="row mt-5">
			<div class="col-12 col-md-6">
				<h2>Input</h2>
				<p>Enter the raffle ID</p>

				<input class="form-control" v-model="raffle" type="text" placeholder="Raffle Key" required>
				<input class="form-control mt-3" placeholder="Raffle entry cost" v-model="entryCost" type="number" min="0" step="0.1" required>
			</div>
			<div class="col-12 col-md-6 mt-3 mt-md-0">
				<h2>Output</h2>
				<button class="btn btn-primary btn-lg p-4 mt-5" @click="selectWinner">SELECT WINNER</button>

<!--				<table class="table table-sm">-->
<!--					<thead>-->
<!--					<tr>-->
<!--						<th>Entrant</th>-->
<!--					</tr>-->
<!--					</thead>-->
<!--					<tbody>-->
<!--					<tr v-for="(e,k) in entryArray" :key="k">-->
<!--						<td>{{ e }}</td>-->
<!--					</tr>-->
<!--					</tbody>-->
<!--				</table>-->

			</div>
		</div>
		<div class="row mt-5">
							<div class="col-12">
								<table class="table table-sm">
									<thead>
									<tr>
										<th>Entrant</th>
										<th>Spent</th>
										<th>Tickets</th>
									</tr>
									</thead>
									<tbody>
									<tr v-for="(e,k) in entryMap" :key="k">
										<td>{{ k }}</td>
										<td>{{ e.toLocaleString() }}</td>
										<td>{{ Math.floor(e / entryCost) }}</td>
									</tr>
									</tbody>
								</table>
							</div>
		</div>

		<footer class="footer fw-bold mt-5">
			<p>Built By: <a target="_blank" href="https://x.com/@CloakdDev">@CloakdDev</a></p>
			<p>Shuffle Algo: <code>Fisher–Yates shuffle</code></p>
		</footer>
	</div>
</template>

<script>
import {web3} from "@project-serum/anchor";

export default {
	name: "ChooseWinnerView",
	data() {
		return {
			loading: false,
			loadingStatus: "Pending",
			raffle: "GQTbSGRwVTkF79mroLRMmFQ4ymzXUPe7zGkaLyuuJ7hf",
			winner: "",
			entryCost: 0.69,

			entryMap: {},
			entryArray: [],
		}
	},
	methods: {
		toEntrantArray: function () {
			this.entryArray = []
			if (this.entryCost <= 0) {
				this.$toastr.e("Invalid entry cost")
				return []
			}

			const k = Object.keys(this.entryMap)
			for (let i = 0; i < k.length; i++) {
				const e = this.entryMap[k[i]]
				let tickets = Math.floor(e / this.entryCost)
				for (let t = 0; t < tickets; t++)
					this.entryArray.push(k[i])
			}

			console.log("MAPPER", this.entryArray)
			return this.shuffle(this.entryArray)
		},

		selectWinner: async function () {
			this.loading = true
			await this._selectWinner()
			this.loading = false
		},

		getRandomWinner: function() {
			const ix = Math.floor(Math.random() * this.entryArray.length)
			return this.entryArray[ix]
		},

		_selectWinner: async function () {
			this.loadingStatus = "Loading Raffle.."
			const pk = new web3.PublicKey(this.raffle)
			//Get all signatures
			console.log("PK", pk.toString())

			//Signatures SOL IN
			this.loadingStatus = "Loading Raffle Entrants.."
			await this.heliusTransactions(pk)

			this.loadingStatus = "Building Entry Array..."
			this.toEntrantArray()

			this.loadingStatus = "Selecting winner..."
			this.winner = this.getRandomWinner()
		},
		getRaffleSignatures: async function (address) {
			let transactionListLength = 1000
			const allTransactions = []
			const pubkey = new web3.PublicKey(address);
			let transactionList = await this.$store.state.rpc.client.getSignaturesForAddress(pubkey);
			allTransactions.push(transactionList)
			while (transactionListLength >= 1000) {
				const lastSignature = transactionList[transactionList.length - 1];
				const nextSignatures = await this.$store.state.rpc.client.getSignaturesForAddress(pubkey, {before: lastSignature.signature});
				allTransactions.push(nextSignatures)
				transactionList = nextSignatures
				transactionListLength = nextSignatures.length;
			}
			return allTransactions.flat()
		},

		getSignatureStatus: async function (sigs = []) {
			let sigStatus = []
			const MAX_CHUNK = 256
			const sm = sigs.map((s) => s.signature)
			let ix = 0;

			while (ix <= sm.length) {
				const sl = sm.slice(ix, ix + MAX_CHUNK)
				console.log("SL", sl)
				let sigList = await this.$store.state.rpc.client.getSignatureStatuses(sl, {searchTransactionHistory: true});

				sigStatus.push(sigList.value)
				ix += MAX_CHUNK
			}

			return sigStatus.flat()
		},

		heliusTransactions: async function (pk) {
			const resp = await fetch(`https://api.helius.xyz/v0/addresses/${pk}/transactions?api-key=b6995bc8-7be1-4989-80b5-0e5decd8eabb`)
			if (!resp) {
				this.$toastr.e("Failed to load transactions")
				return
			}

			const js = await resp.json()

			for (let i = 0; i < js.length; i++) {
				const t = js[i]
				if (t.type !== "BUY_TICKETS")
					continue

				const txt = t.tokenTransfers[0]
				if (!this.entryMap[txt.fromUserAccount])
					this.entryMap[txt.fromUserAccount] = txt.tokenAmount
				else
					this.entryMap[txt.fromUserAccount] += txt.tokenAmount

			}
		},
		shuffle: function (array) {
			let m = array.length, t, i;

			// While there remain elements to shuffle…
			while (m) {

				// Pick a remaining element…
				i = Math.floor(Math.random() * m--);

				// And swap it with the current element.
				t = array[m];
				array[m] = array[i];
				array[i] = t;
			}

			return array;
		}
	}
}
</script>

<style scoped>
textarea, input {
	background: transparent;
	border: 2px solid white;
	color: white;
	cursor: pointer;
}

input:active, input:focus {
	background: transparent;
	color: white;
	border: 2px solid white;
}
</style>