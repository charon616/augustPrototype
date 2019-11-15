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

AFRAME.registerComponent('close-button', {
    init: function () {
        const targetObj1 = document.getElementById('cover-scene')
        const targetObj2 = document.getElementById('venue')
        const targetObj3 = document.getElementById('works')
        const closeButton = document.getElementById('closebutton')

        closeButton.onclick = () => {
            targetObj1.object3D.visible = false
            targetObj2.object3D.visible = false
            targetObj3.object3D.visible = false
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

AFRAME.registerComponent('pinch-scale', {
    schema: {
        min: {
            default: 0.3
        },
        max: {
            default: 8
        }
    },
    init: function () {
        this.initialScale = this.el.object3D.scale.clone()
        this.scaleFactor = 1
        this.handleEvent = this.handleEvent.bind(this)
        this.el.sceneEl.addEventListener('twofingermove', this.handleEvent)
    },
    remove: function () {
        this.el.sceneEl.removeEventListener('twofingermove', this.handleEvent)
    },
    handleEvent: function (event) {
        this.scaleFactor *= 1 + event.detail.spreadChange / event.detail.startSpread
        this.scaleFactor = Math.min(Math.max(this.scaleFactor, this.data.min), this.data.max)

        this.el.object3D.scale.x = this.scaleFactor * this.initialScale.x
        this.el.object3D.scale.y = this.scaleFactor * this.initialScale.y
        this.el.object3D.scale.z = this.scaleFactor * this.initialScale.z
    }
})