caribbeanWarApp.service('graphicService', function () {

    //Find canvas
    var canvas = $('#renderCanvas')[0];

    //Timer setup
    var deltaTime = Date.now();
    var delay = 0;

    var scene = sceneTemplates['login'];

    var state = states.stoped;

    var createScene = function (sceneName) {
        if(state == states.stoped){
            state = states.preparing;

            scene.init(canvas);

            var beforeRenderFunction = function () {
                delay = Math.abs(deltaTime - Date.now())*0.001;

                scene.update(delay);

                fps(delay);

                deltaTime = Date.now();
            };

            state = states.running;

            scene.scene.registerBeforeRender(beforeRenderFunction);

            scene.engine.runRenderLoop(function() {
                scene.scene.render();
            });
        }
    };

    var disposeScene = function () {
        if(state == states.running){
            state = states.preparing;

            scene.dispose();

            state = states.stoped;
        }
    };

    window.addEventListener("resize", function () {
        if(engine) engine.resize();
    });

    return {
        create: createScene,
        dispose: disposeScene
    };
});

var sceneTemplates = {
    'login': {
        engine: null,
        scene: null,
        camera: null,
        content: {
            ship: null,
            lines: [],
            options: {
                direction: targetingDirection.both,
                distance: 0,
                angle : 0,
                scatter: 0
            }
        },
        cameraTarget: {
            position: BABYLON.Vector3.Zero(),
            rotation: BABYLON.Vector3.Zero()
        },
        light: (function(){
            if(this.scene){
                var light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(-1, -10, 0), this.scene);
                light.position = new BABYLON.Vector3(20, 40, 20);
                light.diffuse = new BABYLON.Color3(1, 1, 1);
                light.specular = new BABYLON.Color3(1, 1, 1);
                light.intensity = 1;
                return light;
            }
            return null;
        })(),
        init: function (canvas) {
            this.engine = new BABYLON.Engine(canvas, true);
            this.scene = new BABYLON.Scene(this.engine);
            this.camera = new BABYLON.ArcRotateCamera("Camera0", 0, 0, 10, BABYLON.Vector3.Zero(), this.scene);

            this.scene.activeCamera = this.camera;
            this.camera.attachControl(canvas);

            this.content.start = {x: 0, y: 0, z: 0};
            this.content.end = {x: 0, y: 0, z: 50};

            this.content.lines = new BABYLON.Mesh.CreateLines("lines", calculateCurve(this.content.start, this.content.options), this.scene);
        },
        dispose: function () {
            this.engine.stopRenderLoop();
            this.engine.clear(new BABYLON.Color4(0, 0, 0, 0), true, true);
            this.engine.dispose();
        },
        update: function (delay) {
            this.content.options.distance = correctDictance(Math.hypot(this.content.end.x - this.content.start.x, this.content.end.z - this.content.start.z), 20, 100);
            this.content.options.angle = (this.content.options.angle+delay)%(Math.PI*2);
            this.content.options.scatter = (this.content.options.scatter + 0.01) % (Math.PI/6);

            this.content.lines.dispose();
            this.content.lines = new BABYLON.Mesh.CreateLines("lines", calculateCurve(this.content.start, this.content.options), this.scene);
        }
    },
    'harbor': {},
    'world': {}
};


/*
    var ship = BABYLON.Mesh.CreateBox("ship", 5, scene);

    shipControl.initShip(scene, ship);

    var shipMaterial = new BABYLON.StandardMaterial("shipMaterial", scene);
    ship.specularColor = new BABYLON.Color3(1, 1, 1);
    ship.diffuseColor = new BABYLON.Color3(0.3, 0.6, 1);
    ship.material = shipMaterial;

    var cameraTarget = {};
    cameraTarget.position = BABYLON.Vector3.Zero();
    cameraTarget.rotation = BABYLON.Vector3.Zero();

    console.log(scene);

    scene.activeCamera = camera;
    cameraSetup.initCamera(camera, cameraTarget, canvas);
    camera.attachControl(canvas);

    //Light
    var light = null;
    (function(){
        light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(-1, -10, 0), scene);
        light.position = new BABYLON.Vector3(20, 40, 20);
        light.diffuse = new BABYLON.Color3(1, 1, 1);
        light.specular = new BABYLON.Color3(1, 1, 1);
        light.intensity = 1;
    })();

    // Skybox
    var skybox = null;
    (function(){
        skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);

        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("images/TropicalSunnyDay", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

        skybox.material = skyboxMaterial;
    })(scene);

    //Water
    (function(){
        var water = BABYLON.Mesh.CreateGround("water", 5000, 5000, 2, scene);

        var waterMaterial = new BABYLON.StandardMaterial("water", scene);
        waterMaterial.bumpTexture = new BABYLON.Texture("images/water.png", scene);
        waterMaterial.bumpTexture.uOffset = 100;
        waterMaterial.bumpTexture.vOffset = 100;
        waterMaterial.bumpTexture.uScale = 100;
        waterMaterial.bumpTexture.vScale = 100;
        waterMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        waterMaterial.diffuseColor = new BABYLON.Color3(0.653, 0.780, 0.954);
        waterMaterial.alpha = 0.62;

        water.material = waterMaterial;
    })();

    var lines = null;

    var beforeRenderFunction = function () {
        //MOTOR
        delay = Math.abs(deltaTime - Date.now())*0.001;

        shipControl.update(delay);

        cameraTarget.position.x = skybox.position.x = ship.position.x;
        cameraTarget.position.z = skybox.position.z = ship.position.z;

        cameraTarget.position.y = skybox.position.y = 0;
        cameraTarget.rotation.y = ship.rotation.y;

        cameraSetup.correctCamera(-2);

        deltaTime = Date.now();
    };

    scene.registerBeforeRender(beforeRenderFunction);

    */
