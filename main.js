Vue.createApp({
    data() {
        return {
            message: 'Hello Vue!',
            
            init: {
                method: "GET",
                headers: {
                    "X-API-Key": "coik533zHd9jDmsoqMYmbSaeaBDeueE6HxFKgCUX"
                }, 
            },
            
            urlApi: "",
            miembros: [],
            checkboxParty: [],
            estadoSelect: [],
            miembrosFiltrados: [],
            estadosOptions: [],
            miembrosFiltradosEstados: [],
            
            cantidadR: 0,
            cantidadD: 0,
            cantidadID: 0,
            votosR: 0,
            votosD: 0,
            votosID: 0,
            total: 0,
            miembrosTotales: 0,
            
            arrayCortadoMenorC: [],
            arrayCortadoMayorC: [],
            arrayCortadoMenorL: [],
            arrayCortadoMayorL: [],


        }
    },
    
    created() {
        let chamber = document.querySelector(".senate") ? "senate" : "house"

        this.urlApi = `https://api.propublica.org/congress/v1/113/${chamber}/members.json`

        fetch(this.urlApi,this.init)
            .then(response => response.json())
            .then(data => {
                this.miembros = data.results[0].members
                
                this.miembrosFiltrados = this.miembros

                this.miembros.map((estado) => {
                    if(!this.estadosOptions.includes(estado.state)) {
                        this.estadosOptions.push(estado.state);
                    }
                    return this.estadosOptions.sort();
                })
                this.contador()
                this.ordenarDiezPorciento()
            })
    },
        

    methods: {
        
        contador() {
            this.miembros.forEach(miembro => {
            if (miembro.party == "ID") {
                this.cantidadID++;
                this.votosID += miembro.votes_with_party_pct;
            }
            else if (miembro.party == "R") {
                this.cantidadR++;
                this.votosR += miembro.votes_with_party_pct;
            }
            else if (miembro.party == "D") {
                this.cantidadD++;
                this.votosD += miembro.votes_with_party_pct;
            }       
            })
            

            this.total = ((this.votosR + this.votosD + this.votosID)/(this.cantidadR + this.cantidadD + this.cantidadID)).toFixed(2);
            this.votosR = (this.votosR/this.cantidadR).toFixed(2);
            this.votosD = (this.votosD/this.cantidadD).toFixed(2);
            this.votosID = (this.votosID/this.cantidadID).toFixed(2);

            this.miembrosTotales = (this.cantidadR + this.cantidadD + this.cantidadID);

            if (this.cantidadID == 0) {
                this.votosID = 0
            };

        },

        ordenarDiezPorciento() {

            let porcenjateDiezPorc = Math.floor(this.miembrosTotales * 0.10);

            const ordenarMenorC = (x, y) => y.missed_votes_pct - x.missed_votes_pct;
            const ordenarMayorC = (x, y) => x.missed_votes_pct - y.missed_votes_pct;

            const ordenarMenorL = (x, y) => x.votes_with_party_pct - y.votes_with_party_pct;
            const ordenarMayorL = (x, y) => y.votes_with_party_pct - x.votes_with_party_pct;

            

            
            function cortarArray(array) {
                let arrayCortado = [];
                for (let i = 0; i < porcenjateDiezPorc; i++) {
                    arrayCortado.push(array[i]);
                };
                return arrayCortado;
            };

            let menores = this.miembros.sort(ordenarMenorC);
            this.arrayCortadoMenorC = cortarArray(menores);
            
            let mayores = this.miembros.sort(ordenarMayorC);
            this.arrayCortadoMayorC = cortarArray(mayores);

            let masLeales = this.miembros.sort(ordenarMayorL);
            this.arrayCortadoMayorL = cortarArray(masLeales);
            
            let menosLeales = this.miembros.sort(ordenarMenorL);
            this.arrayCortadoMenorL = cortarArray(menosLeales);
            

        }

    },

    computed: {

        filtrar() {
            
            this.miembrosFiltrados = []
            if (this.checkboxParty.length == 0){
                this.miembrosFiltrados = this.miembros
            } else {
                this.miembros.forEach(miembro => 
                this.checkboxParty.forEach(checkboxValue => {
                    if(miembro.party == checkboxValue){
                        this.miembrosFiltrados.push(miembro)
                    }
                }))
            }if(this.estadoSelect == "all" || this.estadoSelect.length == 0){
                this.miembrosFiltradosEstados = this.miembrosFiltrados
            } else {
                this.miembrosFiltradosEstados = this.miembrosFiltrados.filter(miembro => miembro.state == this.estadoSelect)
                this.miembrosFiltrados = this.miembrosFiltradosEstados
            }
            
        },
        


    },


}).mount('#app')








