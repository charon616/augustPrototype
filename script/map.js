AFRAME.registerComponent('show-map', {
    schema: {
        name: {
            type: 'string'
        }
    },
    init: function () {
        const object3D = this.el.object3D
        const name = this.data.name
        const button = document.getElementById('closebutton')
        button.style.display = 'none'
        object3D.visible = false

        const mapEl = document.createElement('a-entity')
        mapEl.setAttribute('scale', '0.5 0.5 0.5')
        mapEl.setAttribute('my-xrextras-one-finger-rotate')
        setTimeout(() => {
            mapEl.setAttribute('gltf-model', 'url(https://cdn.glitch.com/e2d1efa5-515f-4351-8464-aaad485734c5%2FvenueDraco.gltf?v=1573703760474)');
        }, 4000)

        const showImage = ({
            detail
        }) => {
            if (name != detail.name) {
                return
            }
            this.el.appendChild(mapEl)
            object3D.position.copy(detail.position)
            object3D.quaternion.copy(detail.rotation)
            button.style.display = 'block'
            object3D.visible = true
        }

        const updateImage = ({ detail }) => {
            if (name != detail.name) { return }
            object3D.position.copy(detail.position)
            object3D.quaternion.copy(detail.rotation)
        }

        this.el.sceneEl.addEventListener('xrimagefound', showImage)
        this.el.sceneEl.addEventListener('xrimageupdated', updateImage)
    }
})