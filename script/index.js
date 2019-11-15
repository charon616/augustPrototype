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

// Component that uses the gesture-detector and raycaster to drag and drop an object
AFRAME.registerComponent('hold-drag', {
    schema: {
        cameraId: {
            default: 'camera'
        },
        groundId: {
            default: 'ground'
        },
        dragDelay: {
            default: 300
        },

    },
    init: function () {
        this.camera = document.getElementById(this.data.cameraId)
        this.threeCamera = this.camera.getObject3D('camera')
        this.ground = document.getElementById(this.data.groundId)

        this.internalState = {
            fingerDown: false,
            dragging: false,
            distance: 0,
            startDragTimeout: null,
            raycaster: new THREE.Raycaster(),
        }

        const tapRingInner = document.createElement('a-ring')
        tapRingInner.setAttribute('color', '#0dd')
        tapRingInner.setAttribute('ring-inner', '0.5')
        tapRingInner.setAttribute('ring-outer', '0.75')
        tapRingInner.setAttribute('rotation', '-90 0 0')
        tapRingInner.setAttribute('position', '0 0.1 0')

        this.tapRing = document.createElement('a-entity')
        this.tapRing.id = 'tapRing'
        this.tapRing.setAttribute('visible', 'false')
        this.tapRing.appendChild(tapRingInner)
        this.el.sceneEl.appendChild(this.tapRing)

        this.fingerDown = this.fingerDown.bind(this)
        this.startDrag = this.startDrag.bind(this)
        this.fingerMove = this.fingerMove.bind(this)
        this.fingerUp = this.fingerUp.bind(this)

        this.el.addEventListener('mousedown', this.fingerDown)
        this.el.sceneEl.addEventListener('onefingermove', this.fingerMove)
        this.el.sceneEl.addEventListener('onefingerend', this.fingerUp)
    },
    tick: function () {
        if (this.internalState.dragging) {
            let desiredPosition = null
            if (this.internalState.positionRaw) {

                const screenPositionX = this.internalState.positionRaw.x / document.body.clientWidth * 2 - 1
                const screenPositionY = this.internalState.positionRaw.y / document.body.clientHeight * 2 - 1
                const screenPosition = new THREE.Vector2(screenPositionX, -screenPositionY)

                this.threeCamera = this.threeCamera || this.camera.getObject3D('camera')

                this.internalState.raycaster.setFromCamera(screenPosition, this.threeCamera)
                const intersects = this.internalState.raycaster.intersectObject(this.ground.object3D, true)

                if (intersects.length > 0) {
                    const intersect = intersects[0]
                    this.internalState.distance = intersect.distance
                    desiredPosition = intersect.point
                }
            }

            if (!desiredPosition) {
                desiredPosition = this.camera.object3D.localToWorld(new THREE.Vector3(0, 0, -this.internalState.distance))
            }

            desiredPosition.y = 2
            this.el.object3D.position.lerp(desiredPosition, 0.2)

            this.tapRing.object3D.position.x = this.el.object3D.position.x
            this.tapRing.object3D.position.z = this.el.object3D.position.z
        }
    },
    remove: function () {
        this.el.removeEventListener('mousedown', fingerDown)
        this.el.scene.removeEventListener('onefingermove', fingerMove)
        this.el.scene.removeEventListener('onefingerend', fingerUp)
        this.tapRing.parentNode.removeChild(this.tapRing)
    },
    fingerDown: function (event) {
        this.internalState.fingerDown = true
        this.internalState.startDragTimeout = setTimeout(this.startDrag, this.data.dragDelay)
        this.internalState.positionRaw = event.detail.positionRaw
    },
    startDrag: function (event) {
        if (!this.internalState.fingerDown) {
            return
        }
        this.internalState.dragging = true
        this.internalState.distance = this.el.object3D.position.distanceTo(this.camera.object3D.position)
        this.tapRing.setAttribute('visible', 'true')
        this.tapRing.object3D.scale.copy({
            x: 0.001,
            y: 0.001,
            z: 0.001
        })
        this.tapRing.removeAttribute('animation__scale')
        this.tapRing.setAttribute('animation__scale', {
            property: 'scale',
            dur: 300,
            from: '0.001 0.001 0.001',
            to: '1 1 1',
            easing: 'easeOutQuad',
        })
    },
    fingerMove: function (event) {
        this.internalState.positionRaw = event.detail.positionRaw
    },
    fingerUp: function (event) {
        this.internalState.fingerDown = false
        clearTimeout(this.internalState.startDragTimeout)

        this.internalState.positionRaw = null

        if (this.internalState.dragging) {
            const endPosition = this.el.object3D.position.clone()
            this.el.setAttribute('animation__drop', {
                property: 'position',
                to: `${endPosition.x} 0 ${endPosition.z}`,
                dur: 300,
                easing: 'easeOutQuad',
            })

            this.tapRing.removeAttribute('animation__scale')
            this.tapRing.setAttribute('animation__scale', {
                property: 'scale',
                dur: 300,
                to: '0.001 0.001 0.001',
                easing: 'easeInQuad',
            })
            setTimeout(() => this.tapRing.setAttribute('visible', 'false'), 300)
        }
        this.internalState.dragging = false
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
AFRAME.registerComponent('two-finger-spin', {
    schema: {
        factor: {
            default: 5
        }
    },
    init: function () {
        this.handleEvent = this.handleEvent.bind(this)
        this.el.sceneEl.addEventListener('twofingermove', this.handleEvent)
    },
    remove: function () {
        this.el.sceneEl.removeEventListener('twofingermove', this.handleEvent)
    },
    handleEvent: function (event) {
        this.el.object3D.rotation.y += event.detail.positionChange.x * this.data.factor
    }
})