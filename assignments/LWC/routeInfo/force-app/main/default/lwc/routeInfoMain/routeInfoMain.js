import { LightningElement, wire, track } from 'lwc';
import getRouteStations from '@salesforce/apex/RouteInfoLWCController.getRouteStations';
import getSpeeds from '@salesforce/apex/RouteInfoLWCController.getSpeeds';

export default class RouteInfoMain extends LightningElement {

  @track filteredLocations = [];
  @track filteredDestinations = [];
  @track allStations;
  @track allStationsMap;
  location;
  locationName;
  destination;
  destinationName;
  showLocation = false;
  showDestination = false;
  disableTime = true;
  route;
  routeStations = [];
  speedMap = {};
  @track likeState = {all: true,
               walking: false,
               car: false,
               train: false,
               bicycle: false,
               plane: false,
              };

  handleButtonClick(e){
    let name = e.target.name;
    console.log('hi');
    Object.keys(this.likeState).forEach((key) => { this.likeState[key] = false });
    this.likeState[name]=true;
    console.log(this.likeState);
    this.displayTime(name);
  }
  
  @wire(getRouteStations)
  getRouteStations({ error, data }) {
    if (data) {
      console.log('Data', data);
      this.allStations = JSON.parse(JSON.stringify(data));
      this.allStationsMap = this.allStations.reduce((map, obj) => {
        map[obj.Id] = obj;
        return map;
      }, {});
      this.filteredLocations = [...data];
      this.filteredDestinations = [...data];
      console.log('loc', JSON.parse(JSON.stringify(this.filteredLocations)));
      console.log('all stations map', JSON.parse(JSON.stringify(this.allStationsMap)));
    } else if (error) {
      console.error('Error:', error);
    }
  }

  @wire(getSpeeds)
  getSpeeds({ error, data }) {
    if (data) {
      console.log('Data', data);
      data.forEach(item=>{
        this.speedMap[item.MasterLabel] = item.Speed__c;
      });
      console.log('speed map', this.speedMap);
    } else if (error) {
      console.error('Error:', error);
    }
  }

  removeMenu(){
    setTimeout(() => {
      this.showDestination = false;
      this.showLocation =false;
    }, 100);
  }

  handleLocation(e){
    this.showLocation = true;
    let val = e.target.value;
    if(this.location != undefined && val != this.allStationsMap[this.location].Name){
      this.location = undefined;
      this.disableTime = true;
      this.template.querySelector('.time').innerHTML = "";
      console.log('location removed');
    }
    if(this.location == undefined && this.destination == undefined){
      this.route = undefined;
      console.log('route undefined');
    }
    console.log('all', JSON.parse(JSON.stringify(this.allStations)));
    this.filteredLocations = this.allStations.filter(item => {
      if (this.destination == undefined){
        return item.Name.toLowerCase().includes(val.toLowerCase());
      } else { 
        return item.Name.toLowerCase().includes(val.toLowerCase()) && item.Main_Route__c == this.route && item.Id != this.destination;
      } 
    });
  }

  handleDestination(e){
    this.showDestination = true;
    let val = e.target.value;
    if(this.destination != undefined && val != this.allStationsMap[this.destination].Name){
      this.destination = undefined;
      this.disableTime = true;
      this.template.querySelector('.time').innerHTML = "";
      console.log('destination removed');
    }
    if(this.location == undefined && this.destination == undefined){
      this.route = undefined;
      console.log('route undefined');
    }
    console.log('all', JSON.parse(JSON.stringify(this.allStations)));
    this.filteredDestinations = this.allStations.filter(item => {
      if(this.location == undefined) {
        return item.Name.toLowerCase().includes(val.toLowerCase());
      } else{
        return item.Name.toLowerCase().includes(val.toLowerCase()) && item.Main_Route__c == this.route && item.Id != this.location;
      }       
    });
  }

  handleSelectLocation(e){
    console.log('hi');
    this.location = e.currentTarget.dataset.value;
    this.locationName = e.currentTarget.dataset.label;
    this.route = e.currentTarget.dataset.route;
    this.showLocation = false;
    console.log('loc', this.locationName);
    if(this.location != undefined && this.destination != undefined){
      this.routeStations = this.findRoute(this.destination, this.location);
      this.displayTime("all");
      this.disableTime = false;
    } 
  }

  handleSelectDestination(e){
    this.destination = e.currentTarget.dataset.value;
    this.destinationName = e.currentTarget.dataset.label;
    this.route = e.currentTarget.dataset.route;
    this.showDestination = false;
    if(this.location != undefined && this.destination != undefined){
      this.routeStations = this.findRoute(this.destination, this.location);
      console.log('route stations',this.routeStations);
      this.displayTime("all");
      this.disableTime = false;
    } 
  }

  findRoute = ( location, destination) => {
    let stationArray = [];
    let distance = 0;
    stationArray.push({Station : this.allStationsMap[location].Name , Distance : distance});
    while(location != destination){
      distance += this.allStationsMap[location].Distance__c;
      if('Previous_Station__c' in this.allStationsMap[location]){
        location = this.allStationsMap[location].Previous_Station__c;
      }else{
        break;
      }
      stationArray.push({Station : this.allStationsMap[location].Name , Distance : distance});
      console.log('loc', location);
    }
    if(location != destination){
      return this.findRoute(this.location, this.destination);
    }
    else {
      console.log('statarray last', stationArray[stationArray.length-1].Station, 'locname', this.locationName);
      if(stationArray[stationArray.length-1].Station == this.locationName){
        let totalDistance = stationArray[stationArray.length-1].Distance;
        let start = 0;
        let end = stationArray.length-1;

        while(start <= end){
          stationArray[start].Distance = totalDistance - stationArray[start].Distance;
          if(start != end){
            stationArray[end].Distance = totalDistance - stationArray[end].Distance;
          }  
          let temp = stationArray[start];
          stationArray[start] = stationArray[end];
          stationArray[end] = temp;
          start++;
          end--;
        }
      }
      return stationArray;
    }
  }

  displayTime(arg){
    let distance = this.routeStations[this.routeStations.length-1].Distance;
    let transport = {
                      walking : Math.floor(distance/this.speedMap.walking) + " hrs " + Math.floor(((distance/this.speedMap.walking)-Math.floor(distance/this.speedMap.walking))*60) +" min",
                      car : Math.floor(distance/this.speedMap.car) + " hrs " + Math.floor(((distance/this.speedMap.car)-Math.floor(distance/this.speedMap.car))*60) +" min",
                      train : Math.floor(distance/this.speedMap.train) + " hrs " + Math.floor(((distance/this.speedMap.train)-Math.floor(distance/this.speedMap.train))*60) +" min",
                      bicycle : Math.floor(distance/this.speedMap.bicycle) + " hrs " + Math.floor(((distance/this.speedMap.bicycle)-Math.floor(distance/this.speedMap.bicycle))*60) +" min",
                      plane : Math.floor(distance/this.speedMap.plane) + " hrs " + Math.floor(((distance/this.speedMap.plane)-Math.floor(distance/this.speedMap.plane))*60) +" min",
                    };
    
    let content = this.template.querySelector('.time');
    switch(arg) {
      case "all":
        content.innerHTML = `<p class="slds-text-heading_medium">  Time Taken </p>`;
        Object.keys(transport).forEach((key) => { content.innerHTML += `<p class="slds-text-heading_small">  ${key} : ${transport[key]} </p>`});
        break;
      default:
        content.innerHTML = `<p class="slds-text-heading_medium">  Time Taken using ${arg} </p>
                             <p class="slds-text-heading_large">  ${transport[arg]}</p>`;
    }
  }
}