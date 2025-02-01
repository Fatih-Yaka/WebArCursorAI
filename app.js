// AR Scene Manager
class ARSceneManager {
    constructor() {
        this.scene = document.querySelector('a-scene');
        this.loader = document.querySelector('.arjs-loader');
        this.instructions = document.querySelector('.instructions');
        this.marker = document.querySelector('a-marker');
        this.model = document.querySelector('#building');
        this.modelVisible = false;
        this.lastPosition = null;
        this.lastRotation = null;
        
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
            if (!this.modelVisible) {
                this.modelVisible = true;
                this.lastPosition = this.model.getAttribute('position');
                this.lastRotation = this.model.getAttribute('rotation');
            }
        });

        this.marker.addEventListener('markerLost', () => {
            if (this.modelVisible && this.lastPosition && this.lastRotation) {
                // Model konumunu koru
                this.model.setAttribute('position', this.lastPosition);
                this.model.setAttribute('rotation', this.lastRotation);
                this.model.setAttribute('visible', true);
            }
        });

        // Kamera hareketi
        const camera = document.querySelector('[camera]');
        camera.addEventListener('componentchanged', (evt) => {
            if (this.modelVisible && this.lastPosition) {
                // Model konumunu güncelle
                const worldPos = this.model.object3D.getWorldPosition();
                this.lastPosition = worldPos;
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
        this.position = { x: 1, y: 0, z: 0 }; // Model işaretçinin yanında
        this.initializeModel();
    }

    initializeModel() {
        this.updatePosition(this.position.x, this.position.y, this.position.z);
        this.updateScale(this.scale);
        this.updateRotation(this.rotation.x, this.rotation.y, this.rotation.z);
        
        // Model yüklendiğinde
        this.model.addEventListener('model-loaded', () => {
            console.log('Model yüklendi ve konumu sabitlendi');
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

// Uygulama başlatma
window.onload = function() {
    const arScene = new ARSceneManager();
    const modelManager = new ModelManager(document.querySelector('#building'));
}; 