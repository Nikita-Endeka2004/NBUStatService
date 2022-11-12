import { createApp } from "../../node_modules/vue/dist/vue.esm-browser.prod.js";

const url = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/ovdp?json';

const recalculation = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';

    createApp({
        data(){
            return{

                paydate: '',
                repaydate: '',
                obligation: [],
                recalc: [],
            }
        },

        async mounted(){

            let data = await fetch(url);
            data = await data.json();
            this.obligation = data;  
            let recal = await fetch(recalculation);
            recal = await recal.json();
            this.recalc = recal;
            console.log('Извемение валюты', recal);
            console.log('Массив с датами', data);

        },

        methods:{
        
            isCalcDate(){

                let dateStart = new window.Date(this.paydate);
                let dateFinish = new window.Date(this.repaydate);
                let arrayForCheckValidDate = this.obligation.map((item) => ((new window.Date(item.auctiondate) >= dateStart) && (new window.Date(item.auctiondate) <= dateFinish)));
                console.log(arrayForCheckValidDate);
                let sum = 0;
                for(let i = 0; i < Object.keys(arrayForCheckValidDate).length; i++){
                    if(arrayForCheckValidDate[i]){
                        sum += +this.obligation[i].attraction;
                    }
                }

                console.log(sum);

            },

            forCurrencyTransfer(){

                for(let i = 0; i < Object.keys(this.obligation).length;i++){
                
                    if(this.obligation[i].valcode === 'USD'){
                        this.obligation[i].attraction = this.obligation.attraction * this.recalc[25].rate;
                    }
                    
                    if(this.obligation[i].valcode === 'EUR'){
                        this.obligation[i].attraction = this.obligation.attraction * this.recalc[32].rate;
                    }
                }

            },


        },

    }).mount('#app');