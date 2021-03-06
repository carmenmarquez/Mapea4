goog.provide('M.impl.format.GeoJSON');

goog.require('ol.format.GeoJSON');

/**
 * @classdesc
 * Feature format for reading and writing data in the GeoJSON format.
 *
 * @constructor
 * @extends {ol.format.JSONFeature}
 * @param {olx.format.GeoJSONOptions=} opt_options Options.
 * @api stable
 */
M.impl.format.GeoJSON = function(opt_options) {
  var options = opt_options ? opt_options : {};
  goog.base(this, options);
};
goog.inherits(M.impl.format.GeoJSON, ol.format.GeoJSON);

/**
 * @inheritDoc
 */
M.impl.format.GeoJSON.prototype.readFeatureFromObject = function(
  object, opt_options) {
  var geoJSONFeature = /** @type {GeoJSONFeature} */ (object);
  goog.asserts.assert(geoJSONFeature.type == 'Feature',
    'geoJSONFeature.type should be Feature');
  var geometry = ol.format.GeoJSON.readGeometry_(geoJSONFeature.geometry,
    opt_options);
  var feature = new ol.Feature();
  // geometry
  if (this.geometryName_) {
    feature.setGeometryName(this.geometryName_);
  }
  feature.setGeometry(geometry);
  // id
  if (!M.utils.isNullOrEmpty(geoJSONFeature.id)) {
    feature.setId(geoJSONFeature.id);
  }
  else {
    feature.setId(M.utils.generateRandom("geojson_"));
  }
  // properties
  if (geoJSONFeature.properties) {
    feature.setProperties(geoJSONFeature.properties);
  }
  // click function
  if (geoJSONFeature.click) {
    feature.click = geoJSONFeature.click;
  }
  // vendor parameters
  if (geoJSONFeature.properties && geoJSONFeature.properties.vendor && geoJSONFeature.properties.vendor.mapea) {
    // icons
    if (geoJSONFeature.properties.vendor.mapea.icon) {
      M.impl.format.GeoJSON.applyIcon(feature, geoJSONFeature.properties.vendor.mapea.icon);
    }
  }
  return feature;
};

/**
 * @inheritDoc
 */
M.impl.format.GeoJSON.prototype.writeFeatureObject = function(
  feature, opt_options) {
  opt_options = this.adaptOptions(opt_options);
  var object = {
    'type': 'Feature'
  };

  var id = feature.getId();
  if (id) {
    object['id'] = id;
  }
  var geometry = feature.getGeometry();
  if (geometry) {
    object['geometry'] =
      ol.format.GeoJSON.writeGeometry_(geometry, opt_options);
  }
  else {
    object['geometry'] = null;
  }
  var properties = feature.getProperties();
  delete properties[feature.getGeometryName()];
  if (!goog.object.isEmpty(properties)) {
    object['properties'] = properties;
  }
  else {
    object['properties'] = null;
  }

  if (!M.utils.isNullOrEmpty(feature.click)) {
    object['click'] = feature.click;
  }
  return object;
};

/**
 * @inheritDoc
 */
M.impl.format.GeoJSON.prototype.readProjectionFromObject = function(object) {
  var geoJSONObject = /** @type {GeoJSONObject} */ (object);
  var crs = geoJSONObject.crs;
  if (crs) {
    if (crs.type == 'name') {
      return ol.proj.get(crs.properties.name);
    }
    else if (crs.type == 'EPSG') {
      // 'EPSG' is not part of the GeoJSON specification, but is generated by
      // GeoServer.
      // TODO: remove this when http://jira.codehaus.org/browse/GEOS-5996
      // is fixed and widely deployed.
      return ol.proj.get('EPSG:' + crs.properties.code);
    }
    else {
      goog.asserts.fail('Unknown crs.type: ' + crs.type);
      return null;
    }
  }
  else {
    return "EPSG:4326";
  }
};


M.impl.format.GeoJSON.applyIcon = function(feature, icon) {

  var imgIcon = document.createElement('IMG');
  imgIcon.src = icon.url;
  imgIcon.width = icon.width;
  imgIcon.height = icon.height;
  imgIcon.crossOrigin = "anonymous";

  var imgAnchor;
  if (icon.anchor && icon.anchor.x && icon.anchor.y) {
    imgAnchor = [icon.anchor.x, icon.anchor.y];
  }
  feature.setStyle(new ol.style.Style({
    'image': new ol.style.Icon({
      // 'src': icon.url
      'img': imgIcon,
      'imgSize': [icon.width, icon.height],
      'anchor': imgAnchor
    })
  }));
};

/**
 * @inheritDoc
 */
M.impl.format.GeoJSON.prototype.write = function(features) {
  return features.map(function(feature) {
    return this.writeFeatureObject(feature.getImpl().getOLFeature());
  }.bind(this));
};
