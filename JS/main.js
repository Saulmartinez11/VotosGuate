const $grafica = document.getElementById('myChart');

const informamesa = document.querySelector('.info-mesas')

const contenedorgrafica = document.querySelector('.grafics')

const graficaheader = document.querySelector('.header-consulta')

const boton = document.querySelector('.btn-primary')
boton.addEventListener('click', () => {
  document.querySelector('.esconder-menu  ').click()
})

let myChart
let myChart2

obtieneInfo()

function obtieneInfo(){
let eleccion = document.getElementById('tipoConsultaEleccion')
let tipoeleccion = eleccion.value
let departamento = document.getElementById('tipoConsultaDepartamento')
let tipodepartamento = departamento.value
let municipio = document.getElementById('tipoConsultaMunicipio')
let tipomunicipio = municipio.value

fetch(`https://votosgt.azurewebsites.net/api/votos?d=${tipodepartamento}&m=${tipomunicipio}&te=${tipoeleccion}`, {method: 'GET'})
.then (respuesta => respuesta.json())
.then(respuesta => JSON.parse(respuesta))
.then(response => {
const jsonCompleto = response
const jsonMesas = response.MESASPROCESADAS
const jsonVotos = response.VOTOS
const jsonParticipacion = response.PARTICIPACION

mostrarInfo(jsonMesas)
graficaVotos(jsonVotos)
graficaParticipacion(jsonParticipacion)
pageHeader(jsonCompleto)
tablavotos(jsonVotos,jsonCompleto)

})
}

function mostrarInfo(jsonMesas){

  const titulo = document.createElement('h3')
  titulo.textContent = jsonMesas[0].D + ':'

  const cantidadmesas = document.createElement('h4')
  cantidadmesas.textContent = jsonMesas[0].MESASPRO

  const titulo2 = document.createElement('h3')
  titulo2.textContent = ('Mesas no procesadas:')

  const cantidadmesasno = document.createElement('h4')
  cantidadmesasno.textContent = jsonMesas[0].MESASFALT

  const titulo3 = document.createElement('h3')
  titulo3.textContent = ('Total de Mesas:')

  const cantidadmesastotal = document.createElement('h4')
  cantidadmesastotal.textContent = parseInt(jsonMesas[0].MESASFALT) + parseInt(jsonMesas[0].MESASPRO) 
  
  informamesa.innerHTML = ''
  informamesa.appendChild(titulo)
  informamesa.appendChild(cantidadmesas)
  informamesa.appendChild(titulo2)
  informamesa.appendChild(cantidadmesasno)
  informamesa.appendChild(titulo3)
  informamesa.appendChild(cantidadmesastotal)

}

function graficaVotos(jsonVotos){

let etiquetas = []
for (let i=0; i<jsonVotos.length; i++){
  etiquetas[i] = jsonVotos[i].S
}
let cantidadvotos = []
for (let i=0; i<jsonVotos.length; i++){
  cantidadvotos[i] = jsonVotos[i].V
}
let colorfondo = []
for (let i=0; i<jsonVotos.length; i++){
  colorfondo[i] = jsonVotos[i].C
}

if(myChart){
  myChart.destroy()
}

myChart = new Chart($grafica, {
  type: 'bar',
  data: {
      labels: etiquetas,
      datasets: [{
          label: 'Votos por Organización Pólitica',
          data: cantidadvotos,
          backgroundColor: colorfondo,
          borderColor: colorfondo,
          borderWidth: 1
      }]
  },
  options: {
    indexAxis: 'x',
      scales: {
          y: {
              beginAtZero: true
          }
      }
  }
});
  
}




const $grafica2 = document.getElementById('myChart2')
function graficaParticipacion(jsonParticipacion){

let etiquetas = []
for (let i=0; i<jsonParticipacion.length; i++){
  etiquetas[i] = jsonParticipacion[i].D
}
let cantidadvotos = []
for (let i=0; i<jsonParticipacion.length; i++){
  cantidadvotos[i] = jsonParticipacion[i].V
}
let colorfondo = []
for (let i=0; i<jsonParticipacion.length; i++){
  colorfondo[i] = jsonParticipacion[i].C
}


if(myChart2){
  myChart2.destroy()
}

myChart2 = new Chart($grafica2, {
  type: 'doughnut',
  data: {
      labels: etiquetas,
      datasets: [{
          label: 'Participación',
          data: cantidadvotos,
          backgroundColor: colorfondo,
          hoverOffset: 1
      }]
  }
});
  
}




function pageHeader(jsonCompleto){
  const tiposeleccion = document.createElement('h3')
  tiposeleccion.textContent = jsonCompleto.NTE
  
  const breakpoint = document.createElement('br')

  const nivelConsulta = document.createElement('h4')
  nivelConsulta.textContent = jsonCompleto.NMUN + ', ' + jsonCompleto.NDEP

  const FechayHora = document.createElement('h5')
  FechayHora.textContent = 'Fecha y Hora ' + jsonCompleto.FECHAHORA

  graficaheader.innerHTML = ''
  graficaheader.appendChild(tiposeleccion)
  graficaheader.appendChild(breakpoint)
  graficaheader.appendChild(nivelConsulta)
  graficaheader.appendChild(FechayHora)
} 


function tablavotos(jsonVotos,jsonCompleto){
    contenido.innerHTML = ''
    for(let valor of jsonVotos){
        contenido.innerHTML += `

        <tr>
            <td>${valor.S}</td>
            <td>${valor.F}</td>
            <td>${valor.P}</td>
        </tr>
     
      
        `
    }
    for(let i=0;i<1;i++){
        contenido.innerHTML += `
      <tr>
        <td>Total votos válidos:</td>
        <td>${jsonCompleto.VOTOSVALIDOS}</td>
        <td>${jsonCompleto.PVOTOSVALIDOS}</td>
    </tr>
    
    
    <tr>
        <td>Votos nulos:</td>
        <td>${jsonCompleto.NULOS}</td>
        <td>${jsonCompleto.PNULOS}</td>
    </tr>
    <tr>
        <td>Votos en blanco:</td>
        <td>${jsonCompleto.BLANCOS}</td>
        <td>${jsonCompleto.PBLANCOS}</td>
    </tr>
    <tr>
        <td>Total votos válidamente emitidos:</td>
        <td>${jsonCompleto.TOTALACTA}</td>
        <td>${jsonCompleto.PTOTALACTA}</td>
    </tr>
    <tr>
        <td>Votos inválidos:</td>
        <td>${jsonCompleto.INVALIDOS}</td>
        <td>${jsonCompleto.PINVALIDOS}</td>
    </tr>
    <tr>
        <td>Impugnaciones:</td>
        <td>${jsonCompleto.CNTIMPUGNA}</td>
        <td>${jsonCompleto.PCNTIMPUGNA}</td>
    </tr>
      
        `
    }

}
