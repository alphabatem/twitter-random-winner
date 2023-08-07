import {web3} from "@project-serum/anchor";

export default {
	namespaced: true,
	state: () => ({
		client: new web3.Connection("https://rpc.helius.xyz/?api-key=b6995bc8-7be1-4989-80b5-0e5decd8eabb", "confirmed")
	}),
	mutations: {
		//
	}
}
