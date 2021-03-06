goog.provide('M.impl.handler.Features');

goog.require('M.utils');
goog.require('M.exception');
goog.require('M.impl.Layer');

(function() {
  /**
   * @classdesc
   * Main constructor of the class. Creates a KML layer
   * with parameters specified by the user
   *
   * @constructor
   * @param {ol.Map} options custom options for this layer
   * @api stable
   */
  M.impl.handler.Features = (function(options = {}) {
    /**
     * OpenLayers map
     * @private
     * @type {M.impl.Map}
     */
    this.map_ = null;
  });

  /**
   * This function destroys this layer, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.handler.Features.prototype.addTo = function(map) {
    this.map_ = map;
  };

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.handler.Features.prototype.getFeaturesByLayer = function(evt, layer) {
    let features = [];

    if (!M.utils.isNullOrEmpty(layer) && layer.isVisible() && !M.utils.isNullOrEmpty(layer.getImpl().getOL3Layer())) {
      this.map_.getMapImpl().forEachFeatureAtPixel(evt.pixel, function(feature, olLayer) {
        if (layer.getImpl().getOL3Layer() === olLayer) {
          features.push(M.impl.Feature.olFeature2Facade(feature));
        }
      });
    }

    return features;
  };

  /**
   * This function destroys this layer, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.handler.Features.prototype.destroy = function() {
    // unlisten event
    this.map_.un('click', this.onMapClick_, this);
    this.map_ = null;
  };
})();
