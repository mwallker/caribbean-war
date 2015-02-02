caribbeanWarApp.service('graphicService', function ($q) {
    var deferred = $q.defer();

    //Find canvas
    var canvas = $('#renderCanvas')[0];

    //Timer setup
    var deltaTime = Date.now();
    var delay = 0;

    //Create scene
    var engine, scene, camera;

    var createScene = function () {
        engine = new BABYLON.Engine(canvas, true);
        scene = new BABYLON.Scene(engine);
        camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, BABYLON.Vector3.Zero(), scene);

        scene.activeCamera = camera;
        //cameraSetup.initCamera(camera, cameraTarget, canvas);
        camera.attachControl(canvas);

        engine.runRenderLoop(function() {
            scene.render();
        });
    }

    var disposeScene = function () {
        engine.stopRenderLoop();

        camera.dispose();
        scene.dispose();
        engine.dispose();
    }


    window.addEventListener("resize", function () {
        if(engine) engine.resize();
    });
    //
    //
    return {
        create: createScene,
        dispose: disposeScene
    };
});

/*
    var engine = new BABYLON.Engine(canvas, true);

    var scene = new BABYLON.Scene(engine);



    var ship = BABYLON.Mesh.CreateBox("ship", 5, scene);

    shipControl.initShip(scene, ship);

    var shipMaterial = new BABYLON.StandardMaterial("shipMaterial", scene);
    ship.specularColor = new BABYLON.Color3(1, 1, 1);
    ship.diffuseColor = new BABYLON.Color3(0.3, 0.6, 1);
    ship.material = shipMaterial;

    var cameraTarget = {};
    cameraTarget.position = BABYLON.Vector3.Zero();
    cameraTarget.rotation = {y: 0};

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
    })();

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
