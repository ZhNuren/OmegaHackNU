import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {
  AmbientLight,
  DirectionalLight,
  Matrix4,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import * as XLSX from 'xlsx';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import {Loader} from "@googlemaps/js-api-loader";
import * as THREE from 'three';
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
declare let google: any;
import angular from '@angular/cli'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit{
  title = 'map';
  excelData: any[] = [];
  id: number = -1;
  map: any;
  list: MapInfo[] = [new MapInfo(40.74848925, -73.98557857, 24, 89.38082797, 'null',21545, 8.67, 14.6, 0.6827, 'UNKNOWN', '')];
  t_list: any[];
  currentPoint: number = 0;
  @ViewChild('mapElement') mapElement: any;
  positions: any[] = [[40.74848925, -73.98557857]];
  t_positions: any[] = [];
  floor: number = 1;
  sheetNames: any[] = [];
  mapOptions = {
    "tilt": 0,
    "heading": 0,
    "zoom": 16,
    "center": { lat: this.positions[this.positions.length-1][0], lng: this.positions[this.positions.length-1][1]},
    "mapId": "b8c3f51ec4b81d3c"
  }

  apiOptions = {
    "apiKey": 'AIzaSyAUnQlbTnuadILbXCkyIEaroRdhMNpNJ1k',
    "version": "beta"
  };

  showTrace: boolean = false;
  nextPoint: boolean = false;
  animatedPoint: number = 0;
  pointCount: number = this.positions.length;
  modelChanges: boolean = false;
  constFloor: number = 5;
  constructor() {
  }
  ngOnInit() {
  }
  ngAfterViewInit() {
    let apiLoader = new Loader(this.apiOptions);
    apiLoader.load();

    this.map = new google.maps.Map(document.getElementById("map"), this.mapOptions);
    this.initWebGLOverlayView(this.map);
  }

  initWebGLOverlayView(map: any) {
    let scene1: any,  cylinder: any, gltf: any, scene2: any, geometry:any, material:any,geometry3:any, material3:any, renderer: any, camera: any, camera2: any, loader: any, action: any, mixer: any;
    console.log('here');
    let webGLOverlayView = new google.maps.WebGLOverlayView();

    webGLOverlayView.onAdd = () => {
      // set up the scene
      scene1 = new THREE.Scene();
      scene2 = new THREE.Scene();

      camera = new THREE.PerspectiveCamera();
      camera2 = new THREE.PerspectiveCamera();

      let ambientLight = new THREE.AmbientLight( 0xffffff, 0.75 ); // soft white light
      scene1.add(ambientLight);
      scene2.add(ambientLight);
      let directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
      directionalLight.position.set(0.5, -1, 0.5);
      scene1.add(directionalLight);
      scene2.add(directionalLight);


      material3 = new THREE.MeshNormalMaterial();
      material3.opacity = 0.2;
      material3.transparent = true;
      geometry3 = new THREE.CylinderGeometry( this.list[this.animatedPoint].horizontal_acc, this.list[this.animatedPoint].horizontal_acc, this.list[this.animatedPoint].vertical_acc,32);
      cylinder = new THREE.Mesh( geometry3, material3 );
      cylinder.rotation.x = 90 * Math.PI/180;
      cylinder.name = "cyl";
      scene2.add(cylinder);

      geometry = new THREE.BoxGeometry( this.list[this.animatedPoint].floor > 0 ? this.constFloor : this.list[this.animatedPoint].altitude/this.list[this.animatedPoint].floor, this.list[this.animatedPoint].floor > 0 ? this.constFloor : this.list[this.animatedPoint].altitude/this.list[this.animatedPoint].floor, this.list[this.animatedPoint].floor > 0 ? this.constFloor : this.list[this.animatedPoint].altitude/this.list[this.animatedPoint].floor );
      material = new THREE.MeshBasicMaterial( {color: 0x00ff00,transparent: true, opacity: 0.5, vertexColors: true, shadowSide: THREE.BackSide});
      var zDistance = this.list[this.animatedPoint].floor > 0 ? this.list[this.animatedPoint].altitude/this.list[this.animatedPoint].floor : this.constFloor;
      for(var i = 0; i < (this.list[this.animatedPoint].floor>0 ? this.list[this.animatedPoint].floor : Math.ceil(this.list[this.animatedPoint].altitude/this.constFloor)); i++){
        var mesh  = new THREE.Mesh(geometry, material);
        mesh.position.z = (zDistance * i);
        mesh.name = "building";
        scene1.add(mesh);
      };

      loader = new GLTFLoader();
      loader.load(
        'assets/pedestrian.gltf',
        function (gltf: GLTF) {
          gltfmodel(scene2, gltf, "running");
        }
      );



    }


    function gltfmodel(scn: any,gltf:any, actiontype:any){
      let model = gltf.scene;
      model.scale.set(3,3,3);

      // model.rotation.x = 30 * Math.PI/180;
      mixer = new THREE.AnimationMixer(model);
      // const clips = gltf.animations;
      // const clip = THREE.AnimationClip.findByName(clips,'CubeAction');
      if(actiontype == "running" || actiontype=="cycling"  || actiontype == "driving")
      action = mixer.clipAction(gltf.animations[0]);
    else if(actiontype == "swimming")
        action = mixer.clipAction(gltf.animations[1]);
      else if(actiontype == "walking")
        action = mixer.clipAction(gltf.animations[2]);
      action.play();
      console.log(gltf.animations);
      scn.add(gltf.scene);
      console.log(scn);

    }

    let clock = new THREE.Clock();

    // @ts-ignore
    webGLOverlayView.onContextRestored = ({gl}) => {
      // create the three.js renderer, using the
      // maps's WebGL rendering context.
      renderer = new THREE.WebGLRenderer({
        canvas: gl.canvas,
        context: gl,
        ...gl.getContextAttributes(),
      });
      renderer.autoClear = false;

      // wait to move the camera until the 3D model loads
      // @ts-ignore
      function animatet(){
        window.requestAnimationFrame(animatet);
        if(mixer){
          mixer.update(clock.getDelta());
        }
      }
      loader.manager.onLoad = () => {
        // renderer.setAnimationLoop((animate));
        // @ts-ignore
        renderer.setAnimationLoop(() => {
          animatet();
          map.moveCamera({
            "tilt": this.mapOptions["tilt"]+80,
            "heading": this.mapOptions["heading"]+=0.2,
            "zoom": this.mapOptions.zoom+3,
            "center": this.mapOptions.center
          });


        });
      }
    }
    var rate = 100;
    console.log(rate);
    var rate2 = rate;
    let temp_position = Object.assign({}, this.positions[this.animatedPoint]);
    let temp_position2 = Object.assign({}, this.positions[this.animatedPoint+1]);
    // @ts-ignore
    webGLOverlayView.onDraw = ({gl, transformer}) => {
      if (this.modelChanges) {
        this.animatedPoint = 0;
        this.nextPoint = false;
        this.showTrace = false;
        this.positions = this.t_positions;
        this.mapOptions.center.lat = this.positions[this.animatedPoint];
        this.mapOptions.center.lng = this.positions[this.animatedPoint+1];
        temp_position = Object.assign({}, this.positions[this.animatedPoint]);
        temp_position2 = Object.assign({}, this.positions[this.animatedPoint+1]);
        rate = 100;
        this.list = this.t_list;
        this.modelChanges = false;
        scene1.clear()
        for(var i = 0; i < (this.list[this.animatedPoint].floor>0 ? this.list[this.animatedPoint].floor : Math.ceil(this.list[this.animatedPoint].altitude/this.constFloor)); i++){
          var mesh  = new THREE.Mesh(geometry, material);
          mesh.position.z = ((this.list[this.animatedPoint].floor > 0 ? this.list[this.animatedPoint].altitude/this.list[this.animatedPoint].floor : this.constFloor) * i);
          scene1.add(mesh);
        };
        console.log('floor');
        console.log((this.list[this.animatedPoint].floor>0 ? this.list[this.animatedPoint].floor : Math.ceil(this.list[this.animatedPoint].altitude/this.constFloor)));
        console.log(this.list[this.animatedPoint].floor > 0 ? this.constFloor : this.list[this.animatedPoint].altitude/this.list[this.animatedPoint].floor);
        const object = scene2.getObjectByName(cylinder.name);
        object.geometry.dispose();
        object.material.dispose();
        scene2.remove( object );
        geometry3 = new THREE.CylinderGeometry( this.list[this.animatedPoint].horizontal_acc, this.list[this.animatedPoint].horizontal_acc, this.list[this.animatedPoint].vertical_acc,32);
        cylinder = new THREE.Mesh( geometry3, material3 );
        cylinder.rotation.x = 90 * Math.PI/180;
        cylinder.name = "cyl";
        scene2.add(cylinder);
        var actntpy = this.list[this.animatedPoint].activity;
        if(actntpy==="walking" || actntpy==="swimming" || actntpy==="running"){
          const object = scene2.getObjectByName("Scene");

          scene2.remove( object );
          loader.load(
            'assets/pedestrian.gltf',
            function (gltf: GLTF) {
              gltfmodel(scene2, gltf, actntpy);
            }
          );
        }
        else if (actntpy === "driving"){
          const object = scene2.getObjectByName("Scene");

          scene2.remove( object );
          loader.load(
            'assets/car.gltf',
            function (gltf: GLTF) {
              gltfmodel(scene2, gltf, actntpy);
            }
          );
        }
        else if (actntpy === "cycling"){
          const object = scene2.getObjectByName("Scene");

          scene2.remove( object );
          loader.load(
            'assets/bike.gltf',
            function (gltf: GLTF) {
              gltfmodel(scene2, gltf, actntpy);
            }
          );
        }
        console.log(scene2)

      }

      var x = this.positions.length<2 ? 0: (this.positions[this.animatedPoint][0]-this.positions[this.animatedPoint+1][0])/rate2;
      var y = this.positions.length<2 ? 0: (this.positions[this.animatedPoint][1]-this.positions[this.animatedPoint+1][1])/rate2;

      if (this.nextPoint) {
        if (this.animatedPoint >= this.positions.length-2) {
          this.animatedPoint = 0;
        } else {
          this.animatedPoint += 1;
        }
        rate = 100;
        this.nextPoint = false;
        temp_position = Object.assign({}, this.positions[this.animatedPoint]);
        temp_position2 = Object.assign({}, this.positions[this.animatedPoint+1]);
        scene1.clear();
        for(var i = 0; i < (this.list[this.animatedPoint].floor>0 ? this.list[this.animatedPoint].floor : Math.ceil(this.list[this.animatedPoint].altitude/this.constFloor)); i++){
          var mesh  = new THREE.Mesh(geometry, material);
          mesh.position.z = ((this.list[this.animatedPoint].floor > 0 ? this.list[this.animatedPoint].altitude/this.list[this.animatedPoint].floor : this.constFloor )* i);
          scene1.add(mesh);
        };
        const object = scene2.getObjectByName(cylinder.name);
        object.geometry.dispose();
        object.material.dispose();
        scene2.remove( object );
        geometry3 = new THREE.CylinderGeometry( this.list[this.animatedPoint].horizontal_acc, this.list[this.animatedPoint].horizontal_acc, this.list[this.animatedPoint].vertical_acc,32);
        cylinder = new THREE.Mesh( geometry3, material3 );
        cylinder.rotation.x = 90 * Math.PI/180;
        cylinder.name = "cyl";
        scene2.add(cylinder);

      }
      if (!this.showTrace) {

        var latLngAltitudeLiteral = {
          lat: temp_position[0],
          lng: temp_position[1],
          altitude: this.list[this.animatedPoint].floor > 0 ? this.list[this.animatedPoint].altitude/this.list[this.animatedPoint].floor : this.constFloor
        }

        var latLngAltitudeLiteral2 = {
          lat: temp_position[0],
          lng: temp_position[1],
          altitude: this.list[this.animatedPoint].altitude
        }

        this.mapOptions.center.lat = temp_position[0];
        this.mapOptions.center.lng = temp_position[1];
        var matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral);

        camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);

        var matrix2 = transformer.fromLatLngAltitude(latLngAltitudeLiteral2);

        camera2.projectionMatrix = new THREE.Matrix4().fromArray(matrix2);

        webGLOverlayView.requestRedraw();
        renderer.render(scene2, camera2);
        renderer.render(scene1, camera);
      } else {
        while(!animate(x,y,rate, temp_position,temp_position2,"walking",transformer)){};
        rate--;
      }
      renderer.resetState();
    }
    webGLOverlayView.setMap(map);

    const animate = (x:any, y:any, rate:any, given1:any, given2:any, action:any, transformer:any) =>{

      var latLngAltitudeLiteral = {
        lat: given1[0],
        lng: given1[1],
        altitude: this.list[this.animatedPoint].floor > 0 ? this.list[this.animatedPoint].altitude/this.list[this.animatedPoint].floor : this.constFloor
      }

      var latLngAltitudeLiteral2 = {
        lat: given1[0],
        lng: given1[1],
        altitude: this.list[this.animatedPoint].altitude
      }

      if (rate > 0) {
        given1[0] += x;
        given1[1] += y;
      } else {
        this.nextPoint = true;
      }

      this.mapOptions.center.lat = given1[0];
      this.mapOptions.center.lng = given1[1];

      var matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral);

      camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);

      var matrix2 = transformer.fromLatLngAltitude(latLngAltitudeLiteral2);

      camera2.projectionMatrix = new THREE.Matrix4().fromArray(matrix2);
      webGLOverlayView.requestRedraw();
      renderer.render(scene2, camera2);
      renderer.render(scene1, camera);
      return 1;
    }

  }

  ReadExcel(event: any) {
    let file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);
    fileReader.onload = (event: any) => {
      var workBook = XLSX.read(fileReader.result, {type:'binary'});
      this.sheetNames = workBook.SheetNames;
      for (let w of workBook.SheetNames) {
        this.excelData.push(XLSX.utils.sheet_to_json(workBook.Sheets[w]));
      }
    }
  }

  selectChange() {
    this.t_positions = [];
    this.t_list = [];
    console.log(this.excelData);
    console.log(this.id);
    console.log(this.excelData[this.id]);
    for (let p of this.excelData[this.id]) {
      this.t_positions.push([p.Latitude, p.Longitude]);
      let obj: MapInfo = new MapInfo(p['Longitude'],p['Latitude'],p['Floor label']==='null' ? 0: p['Floor label'],p['Altitude'],p['Identifier'], p['Timestamp'],p['Horizontal accuracy'], p['Vertical accuracy'], p['Confidence in location accuracy'], p['Activity'], p['Identifier'] === 'null' ? this.sheetNames[this.id] : p['Identifier']);
      this.t_list.push(obj);
    }
    this.pointCount = this.t_positions.length;
    this.modelChanges = true;
    console.log(this.list);
  }

  animate() {
    if (this.positions.length>1) {
      this.showTrace = true;
    }
  }
}

export class MapInfo {
  longitude: any;
  latitude: any;
  floor: any;
  altitude: any;
  identifier: any;
  timestamp: any;
  horizontal_acc: any;
  vertical_acc: any;
  conf_acc: any;
  activity: any;
  name: any;

  constructor(longitude: any, latitude: any, floor: any, altitude: any, identifier: any, timestamp: any, horizontal_acc: any, vertical_acc: any, conf_acc: any, activity: any, name: any) {
    this.longitude = longitude;
    this.latitude = latitude;
    this.floor = floor;
    this.altitude = altitude;
    this.identifier = identifier;
    this.timestamp = timestamp;
    this.horizontal_acc = horizontal_acc;
    this.vertical_acc = vertical_acc;
    this.conf_acc = conf_acc;
    this.activity = activity;
    this.name = name;
  }
}
