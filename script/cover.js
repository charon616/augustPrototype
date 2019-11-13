AFRAME.registerComponent('link-with-newwindow', {
    schema: {
        href: { type: 'string', default: '' }
    },
    init: function () {
        this.el.addEventListener('click', (e) => {
            setTimeout(() => {
                if (window.open(this.data.href)) {
                } else {
                    window.location.href = this.data.href;
                };
            }, 300);
        })
    }
})

AFRAME.registerComponent('close-button', {
    init: function () {
        const targetObj1 = document.getElementById('cover-scene')
        const targetObj2 = document.getElementById('venue')
        const targetObj3 = document.getElementById('works')
        const closeButton = document.getElementById('closebutton')

        const logo = document.getElementById("logo-set");
        const snsbutton = document.getElementById("snsbutton");
        let cover_children = snsbutton.children;

        const workplane = document.getElementById('work-plane')
        let work_children = workplane.children;

        closeButton.onclick = () => {
            targetObj1.object3D.visible = false
            targetObj2.object3D.visible = false
            targetObj3.object3D.visible = false
            closeButton.style.display = 'none'
            logo.removeAttribute('mixin');

            for (let i = 0; i < cover_children.length; i++) {
                cover_children.item(i).classList.remove('cantap')
            }
            for (let i = 0; i < work_children.length; i++) {
                work_children.item(i).classList.remove('cantap')
            }
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

AFRAME.registerComponent('show-logo', {
    schema: {
        name: { type: 'string' }
    },

    init: function () {
        const object3D = this.el.object3D
        const name = this.data.name
        const button = document.getElementById('closebutton')
        button.style.display = 'none'
        const logo = document.getElementById("logo-set");
        const snsbutton = document.getElementById("snsbutton");
        const cover_children = snsbutton.children;

        const showImage = ({ detail }) => {
            if (name != detail.name) {
                return
            }
            logo.setAttribute('mixin', 'appearAnimation')
            object3D.position.copy(detail.position)
            object3D.quaternion.copy(detail.rotation)
            object3D.scale.set(detail.scale, detail.scale, detail.scale)
            button.style.display = 'block'
            object3D.visible = true

            for (let i = 0; i < cover_children.length; i++) {
                cover_children.item(i).classList.add('cantap')
            }
        }

        const updateImage = ({
            detail
        }) => {
            if (name != detail.name) {
                return
            }
            object3D.position.copy(detail.position)
            object3D.quaternion.copy(detail.rotation)
            object3D.scale.set(detail.scale, detail.scale, detail.scale)
        }

        this.el.sceneEl.addEventListener('xrimagefound', showImage)
        this.el.sceneEl.addEventListener('xrimageupdated', updateImage)
    }
})

AFRAME.registerComponent('show-work', {
    schema: {
        name: { type: 'string' }
    },
    init: function () {
        const object3D = this.el.object3D
        const name = this.data.name
        const button = document.getElementById('closebutton')
        const arrow = document.getElementById('arrow')
        button.style.display = 'none'

        const workplane = document.getElementById('work-plane')
        let work_children = workplane.children;

        const showImage = ({ detail }) => {
            if (name != detail.name) {
                return
            }
            object3D.position.copy(detail.position)
            object3D.quaternion.copy(detail.rotation)
            object3D.scale.set(detail.scale, detail.scale, detail.scale)
            arrow.object3D.position.copy(detail.position)
            arrow.object3D.quaternion.copy(detail.rotation)

            for (let i = 0; i < work_children.length; i++) {
                work_children.item(i).classList.add('cantap')
            }

            button.style.display = 'block'
            object3D.visible = true
            arrow.objecrt3D.visible = true
        }

        const updateImage = ({ detail }) => {
            if (name != detail.name) {
                return
            }
            object3D.position.copy(detail.position)
            object3D.quaternion.copy(detail.rotation)
            object3D.scale.set(detail.scale, detail.scale, detail.scale)
            arrow.object3D.position.copy(detail.position)
            arrow.object3D.quaternion.copy(detail.rotation)
        }

        this.el.sceneEl.addEventListener('xrimagefound', showImage)
        this.el.sceneEl.addEventListener('xrimageupdated', updateImage)
    }
})

AFRAME.registerComponent('show-map', {
    schema: {
        name: { type: 'string' }
    },
    init: function () {
        const object3D = this.el.object3D
        const name = this.data.name
        const button = document.getElementById('closebutton')
        button.style.display = 'none'

        const showImage = ({detail}) => {
            if (name != detail.name) {
                return
            }
            object3D.position.copy(detail.position)
            object3D.quaternion.copy(detail.rotation)
            button.style.display = 'block'
            object3D.visible = true
        }

        this.el.sceneEl.addEventListener('xrimagefound', showImage)
        this.el.sceneEl.addEventListener('xrimageupdated', showImage)
    }
})

AFRAME.registerComponent('show-caption', {
    schema: {
        num: { type: 'int' },
        title: { type: 'string' },
        name: { type: 'string' },
        caption: { type: 'string' },
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

AFRAME.registerComponent('my-xrextras-one-finger-rotate', {
    init: function () {
        this.handleEvent = this.handleEvent.bind(this)
        this.el.sceneEl.addEventListener('onefingermove', this.handleEvent)
        this.el.setAttribute('class', 'cantap')
    },
    remove: function () {
        this.el.sceneEl.removeEventListener('onefingermove', this.handleEvent)
    },
    handleEvent: function (event) {
        this.el.object3D.rotation.y += event.detail.positionChange.x * 6
    }
})