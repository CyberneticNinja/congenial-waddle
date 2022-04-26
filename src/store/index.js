// store/index.js
import { createStore } from "vuex";
import axios from "axios";
import Cookies from "js-cookie";

const http = axios.create({
  headers: {
    alg: "HS256",
    typ: "JWT",
  },
  responseType:'json',
  withCredentials: true,
});


export default createStore({
  state: {
    recordCount:null,
    records: [],
    errors: null,
    token:null,
    isUserLoggedIn:false
  },
  getters: {
    getRecordCount: (state) => state.recordCount,
    getErrors: (state) => state.errors,
    getRecord: (state) => state.records,
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
        commit("SET_RECORD_COUNT", data.data)
      } catch (error) {
        // alert(error);
      }
    },
    async initialFetchRecords({ commit },credentials) {

      let page = credentials.page
      let itemsPerPage = credentials.itemsperpage

      if(typeof Cookies.get('userdata') !== 'undefined')
      {
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
        commit("SET_RECORD", data.data)
      } catch (error) {
        // alert(error);
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

        commit("SET_RECORD", data.data)

        let parsedData = Cookies.get('userdata')

        //reset cookies with the new credentials
        parsedData = JSON.parse(parsedData)

        //expiration
        let expires = parsedData["expires"]
        expires = new Date(new Date().getTime() + 15 * 60000)

        parsedData["itemsperpage"] = credentials.itemsperpage
        parsedData["page"] = credentials.page

        parsedData = JSON.stringify(parsedData)
        //cookie saved with new data
        Cookies.set('userdata',JSON.stringify({ email:parsedData["email"], expires:expires, page:credentials.page, itemsperpage:credentials.itemsperpage}),{
        })

      } catch (error) {
        // alert(error);
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

        var inSixtyMinutes = new Date(new Date().getTime() + 60 * 60 * 1000)
        var inFifthenMinutes =  new Date(new Date().getTime() + 15 * 60000)
        var inFiveMinutes =  new Date(new Date().getTime() + 5 * 60000)

        //setting cookies
        Cookies.set('token',data.data,{
          expires:inFifthenMinutes
        })
        var userdata = { email:credentials.email, expires:inFifthenMinutes, page:null, itemsperpage:null}

        Cookies.set('userdata',JSON.stringify(userdata),{
          expires:inFifthenMinutes
        })

        var parsedData = Cookies.get('userdata')
        console.log(parsedData)
        commit('SET_TOKEN',data.data)
if(Cookies.get('token'))
{
  commit('SET_IS_USER_LOGGED_IN',true)
}
else
{
  commit('SET_IS_USER_LOGGED_IN',false)
}
      } catch (error) {
        if(error.response)
        {
          commit("SET_ERRORS", error.response.data);
        // alert(error);
        }
      }
    },
  },
  mutations: {
    SET_RECORD_COUNT(state, recordCount) {
      state.recordCount = recordCount;
    },
    SET_RECORD(state, records) {
      state.records = records;
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
