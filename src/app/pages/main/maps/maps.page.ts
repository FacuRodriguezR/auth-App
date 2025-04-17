import { Component, ElementRef, inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { CommonModule } from '@angular/common'; 
import { IonContent } from '@ionic/angular';
declare var google: any;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {
  @ViewChild('map', {static: true}) mapElementRef! : ElementRef;
  @ViewChild(IonContent, { static: false }) content!: IonContent; // Inyectar IonContent
  center: any;
  googleMaps: any;
  map: any;
  marker: any;
  mapListener: any;
  markerListener: any;
  intersectionObserver: any;
  private renderer = inject(Renderer2);
  markers: any[] = [];
  nearestLocation: any = null; // Propiedad para almacenar la ubicación más cercana
  nearestBranchName: string | null = null;  // Propiedad para almacenar el nombre de la sucursal más cercana
  currentLocationMarker: any;
  nearestNumber: string | null = null;

  constructor() { }

  ngOnInit() {
  }

  async ngAfterViewInit(){
    await this.printCurrentPosition();
    this.nearestLocation = this.findNearestLocation();
    this.nearestBranchName = this.nearestLocation.name;
    this.nearestNumber = this.nearestLocation.telefono;
    console.log('Nearest location:', this.nearestBranchName);
     this.loadMap();
   }
 
    printCurrentPosition = async () => {
     const coordinates = await Geolocation.getCurrentPosition();
     this.center = { lat: coordinates.coords.latitude, lng: coordinates.coords.longitude };
   
     console.log('Current position:', coordinates);
   };
 
   async loadMap() {
     const {Map} = await google.maps.importLibrary("maps");
 
     const mapEl = this.mapElementRef.nativeElement;
 
     const location = new google.maps.LatLng(this.center.lat, this.center.lng);
 
     this.map = new Map(mapEl,{
       // center: location,
       center: location,
       zoom: 14,
       mapId: '4504f8b37365c3d0',
 
     });
 
     this.renderer.addClass(mapEl, 'visible');
 
     this.addMarker(location)

     this.addCurrentLocationMarker(location);
   }
 
   async addMarker(location: any){
 
     const {AdvancedMarkerElement, PinElement} = await google.maps.importLibrary("marker");
 
    
 
     const markerIcon = document.createElement('img');
     markerIcon.src = 'assets/icon/LocationTAG.svg';
     markerIcon.height = 70;
     markerIcon.width = 70;
 
     const locations = [
      { 
        lat: -32.92536984827892, 
        lng: -68.82244276687986, 
        name: 'AutoShop - Casa Central', 
        services: ['Alineación y balanceo', 'Lubricentro', 'Neumáticos', 'Frenos', 'Tren Delantero', 'Baterias'],
        imgServices: ['Alineacion y balanceo', 'Lubricentro', 'Neumaticos', 'Frenos', 'Tren Delantero', 'Baterias'], 
        telefono: '2612052000'
      },
      { 
        lat: -32.9349609463873, 
        lng: -68.85054307360623, 
        name: 'AutoShop San Martín Sur', 
        services: ['Balanceo', 'Lubricentro', 'Neumáticos', 'Frenos', 'Tren Delantero', 'Baterias'] ,
        imgServices: ['Alineacion y balanceo', 'Lubricentro', 'Neumaticos', 'Frenos', 'Tren Delantero', 'Baterias'],
        telefono: '2612480424'
      },
      { 
        lat: -34.6147442759817, 
        lng: -58.40716382224365, 
        name: 'AutoShop Balvanera', 
        services: ['Alineación y balanceo', 'Lubricentro', 'Neumáticos', 'Frenos', 'Tren Delantero', 'Baterias'] ,
        imgServices: ['Alineacion y balanceo', 'Lubricentro', 'Neumaticos', 'Frenos', 'Tren Delantero', 'Baterias'],
        telefono: '1157712488' 
      },
      { 
        lat: -34.62709610300982, 
        lng: -58.39093759529961, 
        name: 'AutoShop Constitución', 
        services: ['Alineación y balanceo', 'Lubricentro', 'Neumáticos', 'Frenos', 'Tren Delantero', 'Baterias'] ,
        imgServices: ['Alineacion y balanceo', 'Lubricentro', 'Neumaticos', 'Frenos', 'Tren Delantero', 'Baterias'],
        telefono: '1132281425' 
      },
      { 
        lat: -38.95994510558742, 
        lng: -68.04330265919404, 
        name: 'AutoShop Neuquén', 
        services: ['Alineación y balanceo', 'Lubricentro', 'Neumáticos', 'Frenos', 'Tren Delantero', 'Baterias'] ,
        imgServices: ['Alineacion y balanceo', 'Lubricentro', 'Neumaticos', 'Frenos', 'Tren Delantero', 'Baterias'],
        telefono: '2995127189'
      }
    ];
 
     // Itera sobre el array de ubicaciones y crea un marcador para cada una
     locations.forEach(location => {
       const marker = new AdvancedMarkerElement({
         map: this.map,
         position: location,
         content: markerIcon.cloneNode(true) as HTMLElement // Clona el ícono para cada marcador
       });
 
       this.markers.push(marker); // Almacena el marcador en el array (opcional)
     });
 
   }

   async addCurrentLocationMarker(location: any) {
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    const markerIcon = document.createElement('img');
    markerIcon.src = 'assets/icon/location.svg'; // Ruta al ícono personalizado
    markerIcon.height = 50;
    markerIcon.width = 50;

    const marker = new AdvancedMarkerElement({
      map: this.map,
      position: location,
      content: markerIcon,
    });

    this.currentLocationMarker = marker;
  }
 
   findNearestLocation() {
    const locations = [
      { 
        lat: -32.92536984827892, 
        lng: -68.82244276687986, 
        name: 'AutoShop - Casa Central', 
        services: ['Alineación y balanceo', 'Lubricentro', 'Neumáticos', 'Frenos', 'Tren Delantero', 'Baterias'],
        imgServices: ['Alineacion y balanceo', 'Lubricentro', 'Neumaticos', 'Frenos', 'Tren Delantero', 'Baterias'], 
        telefono: '2612052000'
      },
      { 
        lat: -32.9349609463873, 
        lng: -68.85054307360623, 
        name: 'AutoShop San Martín Sur', 
        services: ['Balanceo', 'Lubricentro', 'Neumáticos', 'Frenos', 'Tren Delantero', 'Baterias'] ,
        imgServices: ['Alineacion y balanceo', 'Lubricentro', 'Neumaticos', 'Frenos', 'Tren Delantero', 'Baterias'],
        telefono: '2612480424'
      },
      { 
        lat: -34.6147442759817, 
        lng: -58.40716382224365, 
        name: 'AutoShop Balvanera', 
        services: ['Alineación y balanceo', 'Lubricentro', 'Neumáticos', 'Frenos', 'Tren Delantero', 'Baterias'] ,
        imgServices: ['Alineacion y balanceo', 'Lubricentro', 'Neumaticos', 'Frenos', 'Tren Delantero', 'Baterias'],
        telefono: '1157712488' 
      },
      { 
        lat: -34.62709610300982, 
        lng: -58.39093759529961, 
        name: 'AutoShop Constitución', 
        services: ['Alineación y balanceo', 'Lubricentro', 'Neumáticos', 'Frenos', 'Tren Delantero', 'Baterias'] ,
        imgServices: ['Alineacion y balanceo', 'Lubricentro', 'Neumaticos', 'Frenos', 'Tren Delantero', 'Baterias'],
        telefono: '1132281425' 
      },
      { 
        lat: -38.95994510558742, 
        lng: -68.04330265919404, 
        name: 'AutoShop Neuquén', 
        services: ['Alineación y balanceo', 'Lubricentro', 'Neumáticos', 'Frenos', 'Tren Delantero', 'Baterias'] ,
        imgServices: ['Alineacion y balanceo', 'Lubricentro', 'Neumaticos', 'Frenos', 'Tren Delantero', 'Baterias'],
        telefono: '2995127189'
      }
    ];
 
     let nearestLocation = null;
     let minDistance = Infinity;
 
     locations.forEach(location => {
       const distance = this.calculateDistance(this.center, location);
       if (distance < minDistance) {
         minDistance = distance;
         nearestLocation = location;
       }
     });
 
     
     
     return nearestLocation;
     
   }
 
   // Función para calcular la distancia euclidiana
   calculateDistance(center: any, location: any): number {
     const latDiff = center.lat - location.lat;
     const lngDiff = center.lng - location.lng;
     return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
   }

   centerOnNearestLocation() {
    if (this.nearestLocation) {
      const nearestLatLng = new google.maps.LatLng(this.nearestLocation.lat, this.nearestLocation.lng);
  
      // Centra el mapa en la ubicación más cercana
      this.map.setCenter(nearestLatLng);
  
      // Opción: agregar un marcador en la ubicación más cercana
      this.addMarker(nearestLatLng);
     
      this.scrollToTop();
  
      console.log(`Centrando mapa en: ${this.nearestLocation.name}`);
    } else {
      console.error('No se encontró la ubicación más cercana');
    }
  }

  openInGoogleMaps() {
    if (this.nearestLocation) {
      const latitude = this.nearestLocation.lat;
      const longitude = this.nearestLocation.lng;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  
      // Abrir el enlace en una nueva ventana o pestaña
      window.open(url, '_blank');
  
      console.log(`Abriendo Google Maps para la ubicación: ${this.nearestLocation.name}`);
    } else {
      console.error('No se encontró la ubicación más cercana');
    }
  }

   // Función para desplazarse hacia arriba
   scrollToTop() {
    this.content.scrollToTop(500); // Desplazarse hacia arriba con una animación de 500ms
  }
  

}
