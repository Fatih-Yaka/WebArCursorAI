// AR Scene Manager
class ARSceneManager {
    constructor() {
        this.scene = document.querySelector('a-scene');
        this.loader = document.querySelector('.arjs-loader');
        this.instructions = document.querySelector('.instructions');
        this.marker = document.querySelector('a-marker');
        this.model = document.querySelector('#building');
        this.persistentParent = document.querySelector('#persistent-parent');
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Scene yükleme olayları
        this.scene.addEventListener('loaded', () => {
            this.loader.style.display = 'none';
        });

        this.scene.addEventListener('camera-error', () => {
            this.showCameraError();
        });

        // Marker olayları
        this.marker.addEventListener('markerFound', () => {
            this.instructions.style.opacity = '0.5';
            this.persistentParent.setAttribute('visible', true);
        });

        // Kamera hareketi
        const camera = document.querySelector('[camera]');
        camera.addEventListener('componentchanged', (evt) => {
            if (this.persistentParent.getAttribute('visible')) {
                // Model görünür durumdaysa pozisyonunu güncelle
                const worldPos = this.model.object3D.getWorldPosition(new THREE.Vector3());
                this.persistentParent.setAttribute('position', worldPos);
            }
        });
    }

    showCameraError() {
        this.loader.innerHTML = `
            <div class="loading-text">
                Kamera erişimi hatası! Lütfen:<br>
                1. Chrome tarayıcısını kullanın<br>
                2. Kamera izinlerini kontrol edin<br>
                3. Sayfayı yenileyin
            </div>`;
    }
}

// Model Manager
class ModelManager {
    constructor(model) {
        this.model = model;
        this.scale = 0.5;
        this.rotation = { x: 0, y: 0, z: 0 };
        this.position = { x: 1, y: 0, z: 0 };
        this.initializeModel();
    }

    initializeModel() {
        this.updatePosition(this.position.x, this.position.y, this.position.z);
        this.updateScale(this.scale);
        this.updateRotation(this.rotation.x, this.rotation.y, this.rotation.z);
        
        this.model.addEventListener('model-loaded', () => {
            console.log('Model yüklendi');
            // Model yüklendiğinde görünürlüğü açık olsun
            this.model.setAttribute('visible', true);
        });
    }

    updateScale(scale) {
        this.scale = scale;
        this.model.setAttribute('scale', `${scale} ${scale} ${scale}`);
    }

    updateRotation(x, y, z) {
        this.rotation = { x, y, z };
        this.model.setAttribute('rotation', `${x} ${y} ${z}`);
    }

    updatePosition(x, y, z) {
        this.position = { x, y, z };
        this.model.setAttribute('position', `${x} ${y} ${z}`);
    }
}

// AR.js ve A-Frame için özel komponent
AFRAME.registerComponent('persistent-model', {
    init: function() {
        this.el.setAttribute('visible', true);
        this.el.setAttribute('position', '1 0 0');
        this.el.setAttribute('rotation', '0 0 0');
        this.el.setAttribute('scale', '0.5 0.5 0.5');
        
        // Model yüklendiğinde
        this.el.addEventListener('model-loaded', () => {
            console.log('Model yüklendi');
            document.querySelector('.arjs-loader').style.display = 'none';
        });
        
        // Model hatası durumunda
        this.el.addEventListener('model-error', () => {
            console.error('Model yüklenemedi');
            document.querySelector('.arjs-loader').innerHTML = `
                <div class="loading-text">
                    Model yüklenemedi!<br>
                    Lütfen sayfayı yenileyin.
                </div>`;
        });
    },
    tick: function() {
        // Model görünürlüğünü sürekli açık tut
        this.el.setAttribute('visible', true);
    }
});

// Sayfa yüklendiğinde
window.addEventListener('load', function() {
    console.log('Sayfa yüklendi');
    
    // AR.js yüklendiğinde
    if (window.AR) {
        console.log('AR.js yüklendi');
    }
    
    // Kamera hatası durumunda
    const scene = document.querySelector('a-scene');
    scene.addEventListener('camera-error', () => {
        document.querySelector('.arjs-loader').innerHTML = `
            <div class="loading-text">
                Kamera erişimi hatası!<br>
                Lütfen:<br>
                1. Chrome tarayıcısını kullanın<br>
                2. Kamera izinlerini kontrol edin<br>
                3. Sayfayı yenileyin
            </div>`;
    });
});

// Uygulama başlatma
window.onload = function() {
    const arScene = new ARSceneManager();
    const modelManager = new ModelManager(document.querySelector('#building'));
}; 