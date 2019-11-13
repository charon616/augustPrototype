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

        closeButton.onclick = () => {
            targetObj1.object3D.visible = false
            targetObj2.object3D.visible = false
            targetObj3.object3D.visible = false
            closeButton.style.display = 'none'
        }

    }
})

AFRAME.registerComponent('tap-place', {
    init: function () {
        const ground = document.getElementById('ground')
        ground.addEventListener('click', event => {
            // Create new entity for the new object
            const newElement = document.createElement('a-entity')

            // The raycaster gives a location of the touch in the scene
            const touchPoint = event.detail.intersection.point
            newElement.setAttribute('position', touchPoint)

            const randomYRotation = Math.random() * 360
            newElement.setAttribute('rotation', '0 ' + randomYRotation + ' 0')

            newElement.setAttribute('visible', 'false')
            newElement.setAttribute('scale', '0.0001 0.0001 0.0001')

            newElement.setAttribute('gltf-model', '#treeModel')
            this.el.sceneEl.appendChild(newElement)

            newElement.addEventListener('model-loaded', () => {
                // Once the model is loaded, we are ready to show it popping in using an animation
                newElement.setAttribute('visible', 'true')
                newElement.setAttribute('animation', {
                    property: 'scale',
                    to: '0.01 0.01 0.01',
                    easing: 'easeOutElastic',
                    dur: 800,
                })
            })
        })
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
        object3D.visible = false
        const logo = document.getElementById("logo-set");

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
        }
        const hideImage = ({ detail }) => {
            if (name != detail.name) {
                return
            }
            logo.removeAttribute('mixin');
            button.style.display = 'none'
            object3D.visible = false
        }

        this.el.sceneEl.addEventListener('xrimagefound', showImage)
        this.el.sceneEl.addEventListener('xrimageupdated', showImage)
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
        object3D.visible = false
        arrow.object3D.visible = false

        const showImage = ({ detail }) => {
            if (name != detail.name) {
                return
            }
            object3D.position.copy(detail.position)
            object3D.quaternion.copy(detail.rotation)
            object3D.scale.set(detail.scale, detail.scale, detail.scale)
            arrow.object3D.position.copy(detail.position)
            arrow.object3D.quaternion.copy(detail.rotation)

            button.style.display = 'block'
            object3D.visible = true
            arrow.objecrt3D.visible = true
        }
        const hideImage = ({ detail }) => {
            if (name != detail.name) {
                return
            }
            button.style.display = 'none'
            object3D.visible = false
        }

        this.el.sceneEl.addEventListener('xrimagefound', showImage)
        this.el.sceneEl.addEventListener('xrimageupdated', showImage)
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
        object3D.visible = false

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