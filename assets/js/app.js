import { createApp } from "../../node_modules/vue/dist/vue.esm-browser.prod.js";

const url = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/ovdp?json';

const recalculation = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';

    createApp({
        data(){
            return{

                paydate: '',
                repaydate: '',
                obligation: [],
                sumForStart: 0,
                sumForEnd: 0,
            }
        },

        async mounted(){

            let data = await fetch(url);
            data = await data.json();
            this.obligation = data;  
            let recal = await fetch(recalculation);
            recal = await recal.json();
            for(let i = 0; i < Object.keys(data).length;i++){
                
                if(data[i].valcode === 'USD'){
                    data[i].attraction = +(data[i].attraction * recal[25].rate).toFixed(2);
                }
                
                if(data[i].valcode === 'EUR'){
                    data[i].attraction = +(data[i].attraction * recal[32].rate).toFixed(2);
                }
            }
            this.obligation = data;  
            console.log('Массив с датами', data);

        },

        methods:{
        
            isCalcStartDate(){

                let dateStart = new window.Date(this.paydate);
                let dateFinish = new window.Date(this.repaydate);
                let arrayForCheckValidDate = this.obligation.map((item) => ((new window.Date(item.paydate) >= dateStart) && (new window.Date(item.paydate) <= dateFinish)));
                //console.log(arrayForCheckValidDate);
                let sum = 0;
                for(let i = 0; i < Object.keys(arrayForCheckValidDate).length; i++){
                    if(arrayForCheckValidDate[i]){
                        sum += +this.obligation[i].attraction;
                    }
                }

                this.sumForStart = (sum / 1000000).toFixed(2);

                //console.log(sum);

            },
            isCalcEndDate(){
                
                let dateStart = new window.Date(this.paydate);
                let dateFinish = new window.Date(this.repaydate);
                let arrayForCheckValidDate = this.obligation.map((item) => ((new window.Date(item.repaydate) >= dateStart) && (new window.Date(item.repaydate) <= dateFinish)));
                // console.log(arrayForCheckValidDate);
                let sum = 0;
                for(let i = 0; i < Object.keys(arrayForCheckValidDate).length; i++){
                    if(arrayForCheckValidDate[i]){
                        sum += +this.obligation[i].attraction;
                    }
                }
                // console.log(sum);

                this.sumForEnd = (sum / 1000000).toFixed(2);

            },

        },

    }).mount('#app');