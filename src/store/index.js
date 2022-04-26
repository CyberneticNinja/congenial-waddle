// store/index.js
import { createStore } from "vuex";
import axios from "axios";
import Cookies from "js-cookie";

const http = axios.create({
  headers: {
    // "X-Requested-With": "XMLHttpRequest",
    // Accept: "application/json",
    // "Content-Type": "application/json",
    alg: "HS256",
    typ: "JWT",
  },
  responseType:'json',
  withCredentials: true,
});


export default createStore({
  state: {
    recordCount:null,
    users: [],
    errors: null,
    token:null,
    isUserLoggedIn:false
  },
  getters: {
    getRecordCount: (state) => state.recordCount,
    getErrors: (state) => state.errors,
    getUsers: (state) => state.users,
    getToken: (state) => state.token,
    getisUserLoggedIn: (state) => state.isUserLoggedIn
  },
  actions: {
    async fetchRecordCount({ commit }) {
      try {
        const data = await http.get(
          'http://localhost:8000/api/clientscount',{
            headers:{
              "Authorization":`Bearer ${Cookies.get('token')}`
            }
          }
        );
        console.log('record count '+data.data)
        commit("SET_RECORD_COUNT", data.data)
      } catch (error) {
        // alert(error);
        console.log(error);
      }
    },
    async initialFetchRecords({ commit },credentials) {

      let page = credentials.page
      let itemsPerPage = credentials.itemsperpage

      if(typeof Cookies.get('userdata') !== 'undefined')
      {
console.log('we are on line 58')
        let parsedData = Cookies.get('userdata')
        parsedData = JSON.parse(parsedData)
        if(parsedData['page'] !== null)  {
          page = parsedData['page']
          itemsPerPage = parsedData['itemsperpage']
        }
      }
      try {
        const data = await http.get(
          'http://localhost:8000/api/clients/page/'+page+'/itemsperpage/'+itemsPerPage,{
            headers:{
              "Authorization":`Bearer ${Cookies.get('token')}`
            }
          }
        );
        console.log(data.data)
        commit("SET_USERS", data.data)
      } catch (error) {
        // alert(error);
        console.log(error);
      }
    },
    async fetchUsers({ commit },credentials) {
      try {
        const data = await http.get(
          'http://localhost:8000/api/clients/page/'+credentials.page+'/itemsperpage/'+credentials.itemsperpage,{
            headers:{
              "Authorization":`Bearer ${Cookies.get('token')}`
            }
          }
        );
        console.log(data.data)

        commit("SET_USERS", data.data)

        let parsedData = Cookies.get('userdata')

        //reset cookies with the new credentials
        parsedData = JSON.parse(parsedData)

        //expiration
        let expires = parsedData["expires"]
        expires = new Date(new Date().getTime() + 15 * 60000)
        console.log('expiration data '+expires)

        parsedData["itemsperpage"] = credentials.itemsperpage
        parsedData["page"] = credentials.page

        // console.log('-------------fetchUsers starts-------------')
        // console.log(parsedData)
        // console.log('-------------fetchUsers ends-------------')

        parsedData = JSON.stringify(parsedData)
        //cookie saved with new data
        Cookies.set('userdata',JSON.stringify({ email:parsedData["email"], expires:expires, page:credentials.page, itemsperpage:credentials.itemsperpage}),{
        })
        // console.log(parsedData)
      } catch (error) {
        // alert(error);
        // console.log(error);
      }
    },
    async login({commit}, credentials) {
      try {
        const data = await http.post("http://localhost:8000/api/login", {
          email: credentials.email,
          password: credentials.password,
        });
        //No errors
        commit("SET_ERRORS", null);
        // console.log(data.data);

        var inSixtyMinutes = new Date(new Date().getTime() + 60 * 60 * 1000)
        var inFifthenMinutes =  new Date(new Date().getTime() + 15 * 60000)
        var inFiveMinutes =  new Date(new Date().getTime() + 5 * 60000)

        //setting cookies
        Cookies.set('token',data.data,{
          expires:inFifthenMinutes
        })
        // Cookies.set('email',credentials.email,{
        //   expires:inFifthenMinutes
        // })

        var userdata = { email:credentials.email, expires:inFifthenMinutes, page:null, itemsperpage:null}

        Cookies.set('userdata',JSON.stringify(userdata),{
          expires:inFifthenMinutes
        })

        var parsedData = Cookies.get('userdata')
        console.log(parsedData)
//this.$emit('successfullogin',true)
        commit('SET_TOKEN',data.data)
if(Cookies.get('token'))
{
  commit('SET_IS_USER_LOGGED_IN',true)
}
else
{
  commit('SET_IS_USER_LOGGED_IN',false)
}
// console.log('we are here')      
      } catch (error) {
        if(error.response)
        {
          commit("SET_ERRORS", error.response.data);
                  // commit("SET_ERRORS", error.response.data);
        // alert(error);
        console.log(error);
        }
      }
    },
  },
  mutations: {
    SET_RECORD_COUNT(state, recordCount) {
      state.recordCount = recordCount;
    },
    SET_USERS(state, users) {
      state.users = users;
    },
    SET_ERRORS(state, errors) {
      state.errors = errors;
    },
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_IS_USER_LOGGED_IN(state, status) {
      state.isUserLoggedIn = status;
    },
  },
});
