const API = "http://127.0.0.1:8000"

function toggleMenu(){

let sidebar = document.getElementById("sidebar")
let overlay = document.getElementById("overlay")

if(sidebar.style.width === "250px"){

sidebar.style.width = "0"
overlay.style.display = "none"

}else{

sidebar.style.width = "250px"
overlay.style.display = "block"

}

}

document.getElementById("overlay").onclick = function(){

document.getElementById("sidebar").style.width="0"
document.getElementById("overlay").style.display="none"

}

function showDashboard(){

document.getElementById("dashboard").style.display="block"
document.getElementById("tripSection").style.display="none"

toggleMenu()

}

function showTrips(){

document.getElementById("dashboard").style.display="none"
document.getElementById("tripSection").style.display="block"

loadTrips()

toggleMenu()

}

function openForm(){

document.getElementById("tripForm").style.display="block"

}

function closeForm(){

document.getElementById("tripForm").style.display="none"

}

async function loadTrips(){

const res = await fetch(API + "/trips")
const data = await res.json()

let rows=""

data.forEach(t=>{

rows += `
<tr>
<td>${t.id}</td>
<td>${t.truck_number}</td>
<td>${t.driver_name}</td>
<td>${t.from_city} → ${t.to_city}</td>
<td>${t.distance}</td>
<td>₹${t.total_fare}</td>

<td>
<button onclick="editTrip(${t.id})">✏️</button>
<button onclick="deleteTrip(${t.id})" class="delete">🗑️</button>
</td>

</tr>
`

})

document.getElementById("tripTable").innerHTML = rows

}
async function addTrip(){

const trip = {

truck_number:document.getElementById("truck_number").value,
driver_name:document.getElementById("driver_name").value,
from_city:document.getElementById("from_city").value,
to_city:document.getElementById("to_city").value,
distance:Number(document.getElementById("distance").value),
rate_per_km:Number(document.getElementById("rate_per_km").value),
toll:Number(document.getElementById("toll").value),
loading_charge:Number(document.getElementById("loading_charge").value),
trip_date:document.getElementById("trip_date").value

}

if(editId){

await fetch(API + "/trips/" + editId,{

method:"PUT",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(trip)

})

editId = null

}else{

await fetch(API + "/trips",{

method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(trip)

})

}

closeForm()
loadTrips()

}

async function deleteTrip(id){

if(!confirm("Delete this trip?")) return

await fetch(API + "/trips/" + id,{
method:"DELETE"
})

loadTrips()

}

let editId = null

async function editTrip(id){

const res = await fetch(API + "/trips")
const data = await res.json()

const trip = data.find(t => t.id === id)

editId = id

truck_number.value = trip.truck_number
driver_name.value = trip.driver_name
from_city.value = trip.from_city
to_city.value = trip.to_city
distance.value = trip.distance
rate_per_km.value = trip.rate_per_km
toll.value = trip.toll
loading_charge.value = trip.loading_charge
trip_date.value = trip.trip_date

openForm()

}