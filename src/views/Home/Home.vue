<template>
    <section>
        <div class="is-size-3 has-text-centered">Home</div>
          <div v-for='record in records' :key='record.id'>
                {{record.id}} <br/>
                {{record.name}} <br/>
                {{record.email}} <br/><br/>       
          </div>
          page : {{ currentpage }} / {{ Math.ceil(recordCount/itemsperpage) }}
          <br/>
          <button @click="previous" class="button is-info">Previous</button> <button @click="next" class="button is-success">Next</button>
    </section>
</template>
<script>
import Cookies from "js-cookie";
export default {
    name:'Home',
    data() {
        return {
            currentpage: 1,
            itemsperpage: 10,
            nextshow:true,
            records:null
        }
    },
    methods: {
        next() {
            let limit = 0
            limit = Math.ceil(this.$store.getters.getRecordCount/this.itemsperpage)
            console.log(limit)
            limit = 10
            
            if(this.currentpage+1 <= limit)
            {
                this.nextshow = true
                this.currentpage++
                this.$store.dispatch("fetchUsers",{
                    page:this.currentpage,
                    itemsperpage:this.itemsperpage
                })    
            }
            else
            {
                this.nextshow = false
            }
        },
        previous() {
            let limit = 0
            if(this.currentpage-1 >=1)
            {
                this.currentpage--
                this.$store.dispatch("fetchUsers",{
                    page:this.currentpage,
                    itemsperpage:this.itemsperpage
                })   
            }         
        }        
    },
    computed: {
        records() {
            return this.$store.getters.getUsers 
        },
        recordCount() {
            return this.$store.getters.getRecordCount
        }
    },
    mounted () {
        //intial value
        let page = 1
        let itemsperpage = 1
        console.log(Cookies.get('userdata'))

        // //cookie exists
        if(typeof Cookies.get('userdata') !== 'undefined')
        {
            // console.log(Cookies.get('userdata'))
            
            let parsedData = Cookies.get('userdata')
            //reset cookies with the new credentials
            parsedData = JSON.parse(parsedData)

            if(parsedData['page'] == null)
            {
                console.log('we are in mounted if(parsedData[page] == null)')
                this.$store.dispatch("initialFetchRecords",{
                    page:1,
                    itemsperpage:10
                })
            }
            else
            {
                console.log('we are in mounted else')
                this.currentpage = parsedData["page"]
                this.$store.dispatch("initialFetchRecords",{
                    page:parsedData["page"] ,
                    itemsperpage:parsedData["itemsperpage"] 
                })
                // this.$store.dispatch("fetchRecordCount")   
                this.currentpage = parsedData['page']
            }       
        }
        //dispatch the amount of records
        this.$store.dispatch("fetchRecordCount");
    },
}
</script>
<style lang="">
    
</style>