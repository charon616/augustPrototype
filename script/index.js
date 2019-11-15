AFRAME.registerComponent('link-with-newwindow', {
    schema: {
        href: {
            type: 'string'
        }
    },
    init: function () {
        this.el.addEventListener('click', (e) => {
            setTimeout(() => {
                if (window.open(this.data.href)) {} else {
                    window.location.href = this.data.href;
                };
            }, 300);
        })
    }
})

const logo = document.getElementById("logo-set");
const cover_object3D = document.getElementById('cover-scene').object3D
const venue_object3D = document.getElementById('venue').object3D
const work_object3D = document.getElementById('works').object3D

AFRAME.registerComponent('close-button', {
    init: function () {     
        const closeButton = document.getElementById('closebutton')
        closeButton.onclick = () => {
            cover_object3D.visible = false
            venue_object3D.visible = false
            work_object3D.visible = false
            closeButton.style.display = 'none'
            logo.removeAttribute('mixin');
        }
    }
})

AFRAME.registerComponent('shadow-material', {
    init: function () {
        this.material = new THREE.ShadowMaterial()
        this.el.getOrCreateObject3D('mesh').material = this.material
        this.material.opacity = 0.3
    }
})

AFRAME.registerComponent('show-caption', {
    schema: {
        num: {　type: 'int'　},
        title: {　type: 'string'　},
        name: {　type: 'string'　},
        caption: {　type: 'string'　},
    },
    init: function () {
        const contents = document.getElementById('contents')
        const container = document.getElementById('container')
        const tapTarget = this.el
        let pageContent = `<h2>${this.data.title}</h2><h3>${this.data.name}</h3><p class="outer">${this.data.caption}</p>`

        tapTarget.addEventListener('click', e => {
            contents.innerHTML = pageContent
            container.classList.remove('collapsed')
        })
    }
})

AFRAME.registerComponent('show-obj', {
    schema: {
        name: { type: 'string' },
        content: { type: 'string' }
    },
    init: function () {
        const object3D = this.el.object3D
        const name = this.data.name
        const button = document.getElementById('closebutton')
        button.style.display = 'none'
        object3D.visible = false

        const showImage = ({ detail }) => {
            if (name != detail.name) {
                return
            }
            if(this.data.type　==　'logo'){
                logo.setAttribute('mixin', 'appearAnimation')
            }
            object3D.position.copy(detail.position)
            object3D.quaternion.copy(detail.rotation)
            object3D.scale.set(detail.scale, detail.scale, detail.scale)
            object3D.visible = true
            button.style.display = 'block'
        }
        this.el.sceneEl.addEventListener('xrimagefound', showImage)
        this.el.sceneEl.addEventListener('xrimageupdated', showImage)
    }
})

AFRAME.registerComponent('show-map', {
    schema: {
        name: {
            type: 'string'
        }
    },
    init: function () {
        const name = this.data.name
        const button = document.getElementById('closebutton')
        button.style.display = 'none'
        venue_object3D.visible = false

        const mapEl = document.createElement('a-entity')
        mapEl.setAttribute('scale', '0.5 0.5 0.5')
        mapEl.setAttribute('xrextras-one-finger-rotate')
        setTimeout(() => {
            mapEl.setAttribute('gltf-model', 'url(https://cdn.glitch.com/e2d1efa5-515f-4351-8464-aaad485734c5%2FvenueDraco.gltf?v=1573703760474)');
        }, 10)

        const showImage = ({
            detail
        }) => {
            if (name != detail.name) {
                return
            }
            this.el.appendChild(mapEl)
            venue_object3D.position.copy(detail.position)
            venue_object3D.quaternion.copy(detail.rotation)
            button.style.display = 'block'
            venue_object3D.visible = true
        }

        const updateImage = ({
            detail
        }) => {
            if (name != detail.name) {
                return
            }
            venue_object3D.position.copy(detail.position)
            venue_object3D.quaternion.copy(detail.rotation)
        }

        this.el.sceneEl.addEventListener('xrimagefound', showImage)
        this.el.sceneEl.addEventListener('xrimageupdated', updateImage)
    }
})