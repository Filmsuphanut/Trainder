import { fb } from "../firebase";
const db = fb.firestore();
import axios from 'axios'
const endpoint = process.env.VUE_APP_ENDPOINT
export default {
    state: {
        friends: []
    },
    actions: {
        report(context, value) {
            let prom = new Promise(async(resolve, reject) => {
                try {
                    let docRef = db.collection("report")
                    let res = await docRef.add(value)
                    resolve(true)
                } catch (err) {
                    console.log(err)
                    reject(false)
                }
            })
            return prom
        },
        fetchFriends() {
            let prom = new Promise(async(resolve, reject) => {
                try {
                    axios.get(`${endpoint}/`, )
                    resolve(true)
                } catch (err) {
                    console.log(err)
                    reject(false)
                }
            })
            return prom
        }
    }
}