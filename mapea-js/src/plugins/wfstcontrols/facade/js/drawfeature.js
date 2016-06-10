goog.provide('P.control.DrawFeature');

(function() {
   /**
    * @classdesc Main constructor of the class. Creates a DrawFeature
    * control to draw features on the map.
    *
    * @constructor
    * @param {M.layer.WFS}
    * layer layer for use in control
    * @extends {M.Control}
    * @api stable
    */
   M.control.DrawFeature = (function(layer) {
      /**
       * Name of the control
       * @public
       * @type {String}
       */
      this.name = M.control.DrawFeature.NAME;

      if (M.utils.isUndefined(M.impl.control.DrawFeature)) {
         M.exception('La implementación usada no puede crear controles DrawFeature');
      }
      // implementation of this control
      var impl = new M.impl.control.DrawFeature(layer);

      // calls the super constructor
      goog.base(this, impl, M.control.DrawFeature.NAME);
   });
   goog.inherits(M.control.DrawFeature, M.Control);

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map}
    * map map to add the control
    * @returns {Promise} html response
    * @api stable
    */
   M.control.DrawFeature.prototype.createView = function(map) {
      return M.template.compile(M.control.DrawFeature.TEMPLATE, {
         'jsonp': true
      });
   };

   /**
    * TODO
    *
    * @public
    * @function
    * @param {HTMLElement} html to add the plugin
    * @api stable
    * @export
    */
   M.control.DrawFeature.prototype.getActivationButton = function(element) {
      return element.querySelector('button#m-button-drawfeature');
   };

   /**
    * This function checks if an object is equals to this control
    *
    * @function
    * @returns {Boolean}
    * @api stable
    */
   M.control.DrawFeature.prototype.equals = function(obj) {
      var equals = (obj instanceof M.control.DrawFeature);
      return equals;
   };

 /**
 * This function set layer for editting
 *
 * @public
 * @function
 * @api stable
 */
  M.control.DrawFeature.prototype.setLayer = function(layer) {
    this.getImpl().layer_ = layer;
  };

   /**
    * Name for this controls
    *
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.DrawFeature.NAME = 'drawfeature';

   /**
    * Template for this controls - button
    *
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.DrawFeature.TEMPLATE = 'drawfeature.html';
})();