// AFRAME.registerComponent('map-display', {
//     schema: {
//         title: { default: '' },
//         artist: { default: '' },
//     },
//     init: function () {
//         // Limit title to 20 characters
//         const displayTitle = this.data.title.length > 20 ? `${this.data.title.substring(0, 17)}...` : this.data.title
//         const text = displayTitle + '\n' + this.data.artist
//         const textData = {
//             align: 'left',
//             width: 0.7,
//             wrapCount: 22,
//             value: text,
//             color: 'white',
//         }

//         this.el.setAttribute('text', textData)

//         // Instantiate a second text object behind the first to achieve an shadow effect
//         const textShadowEl = document.createElement('a-entity')
//         textData.color = 'black'
//         textShadowEl.setAttribute('text', textData)
//         textShadowEl.object3D.position.z = -0.01
//         this.el.appendChild(textShadowEl)
//     }
// })

// AFRAME.registerComponent('play-all-model-animations', {
//     init: function () {
//         this.model = null;
//         this.mixer = null;

//         var model = this.el.getObject3D('mesh');
//         if (model) {
//             this.load(model);
//         } else {
//             this.el.addEventListener('model-loaded', function (e) {
//                 this.load(e.detail.model);
//             }.bind(this));
//         }
//     },

//     load: function (model) {
//         this.model = model;
//         this.mixer = new THREE.AnimationMixer(model);
//         this.model.animations.forEach(animation => {
//             this.mixer.clipAction(animation, model).play();
//         });
//     },

//     tick: function (t, dt) {
//         if (this.mixer && !isNaN(dt)) {
//             this.mixer.update(dt / 1000);
//         }
//     }
// });

// AFRAME.registerComponent('show-detail', {
//     schema: {
//         imgid: { type: 'string', default: '' }
//     },
//     init: function () {
//         this.el.addEventListener('mouseenter', event => {
//             const newElement = document.createElement('a-plane')
//             const pos = this.el.getAttribute('position')

//             newElement.setAttribute('src', this.data.imgid)
//             newElement.setAttribute('height', 1)
//             newElement.setAttribute('width', 3)
//             newElement.setAttribute('material', 'transparent: true;')
//             newElement.setAttribute('shader', 'flat')
//             newElement.setAttribute('look-at', '#camera')
//             newElement.setAttribute('position', {
//                 x: pos.x,
//                 y: pos.y,
//                 z: pos.z
//             })
//             this.el.sceneEl.appendChild(newElement)
//         })

//         this.el.addEventListener('mouseleave', event => {
//             var child = this.el.sceneEl.querySelector('a-plane')
//             this.el.sceneEl.removeChild(child);
//         })

//     }
// })