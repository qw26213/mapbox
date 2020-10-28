<template>
    <div id="map" class="map">
    </div>
</template>
<script>
var map = null
export default {
    data() {
        return {
            activeTab: '0'
        }
    },
    mounted() {
        this.initMap()
    },
    methods: {
        setCenter() {
            const bounds = [78.23, 27.05, 99.25, 36.30];
            map.fitBounds(bounds);
        },
        initMap() {
            const TDTKEY = '50bd53cbf08ec247c7e522291ac1f543'
            const WEBURL = 'http://localhost:8001/lib/mapbox/'
            const tileBase = '.tianditu.gov.cn/DataServer?T='
            const tileXyz = `&tk=${TDTKEY}&x={x}&y={y}&l={z}`
            const center = [116.403, 40.049]
            const vec_w = 'vec_w'
            const cva_w = 'cva_w'
            const img_w = 'img_w'
            const cia_w = 'cia_w'
            const style = {
                version: 8,
                name: 'Dark',
                sources: {
                    TdtVector: {
                        type: 'raster',
                        tiles: [
                            `https://t0${tileBase + vec_w + tileXyz}`,
                            `https://t1${tileBase + vec_w + tileXyz}`,
                            `https://t2${tileBase + vec_w + tileXyz}`,
                            `https://t3${tileBase + vec_w + tileXyz}`,
                            `https://t4${tileBase + vec_w + tileXyz}`,
                            `https://t5${tileBase + vec_w + tileXyz}`,
                            `https://t6${tileBase + vec_w + tileXyz}`,
                            `https://t7${tileBase + vec_w + tileXyz}`
                        ],
                        tileSize: 256
                    },
                    TdtVecLabel: {
                        type: 'raster',
                        tiles: [
                            `https://t0${tileBase + cva_w + tileXyz}`,
                            `https://t1${tileBase + cva_w + tileXyz}`,
                            `https://t2${tileBase + cva_w + tileXyz}`,
                            `https://t3${tileBase + cva_w + tileXyz}`,
                            `https://t4${tileBase + cva_w + tileXyz}`,
                            `https://t5${tileBase + cva_w + tileXyz}`,
                            `https://t6${tileBase + cva_w + tileXyz}`,
                            `https://t7${tileBase + cva_w + tileXyz}`
                        ],
                        tileSize: 256
                    },
                    TdtImage: {
                        type: 'raster',
                        tiles: [
                            `https://t0${tileBase + img_w + tileXyz}`,
                            `https://t1${tileBase + img_w + tileXyz}`,
                            `https://t2${tileBase + img_w + tileXyz}`,
                            `https://t3${tileBase + img_w + tileXyz}`,
                            `https://t4${tileBase + img_w + tileXyz}`,
                            `https://t5${tileBase + img_w + tileXyz}`,
                            `https://t6${tileBase + img_w + tileXyz}`,
                            `https://t7${tileBase + img_w + tileXyz}`
                        ],
                        tileSize: 256
                    },
                    TdtImgLabel: {
                        type: 'raster',
                        tiles: [
                            `https://t0${tileBase + cia_w + tileXyz}`,
                            `https://t1${tileBase + cia_w + tileXyz}`,
                            `https://t2${tileBase + cia_w + tileXyz}`,
                            `https://t3${tileBase + cia_w + tileXyz}`,
                            `https://t4${tileBase + cia_w + tileXyz}`,
                            `https://t5${tileBase + cia_w + tileXyz}`,
                            `https://t6${tileBase + cia_w + tileXyz}`,
                            `https://t7${tileBase + cia_w + tileXyz}`
                        ],
                        tileSize: 256
                    }
                },
                glyphs: WEBURL + "fonts/{fontstack}/{range}.pbf",
                sprite: WEBURL + 'sprite',
                layers: [{
                    id: 'TdtVector',
                    type: 'raster',
                    source: 'TdtVector',
                    minzoom: 3,
                    maxzoom: 18,
                    layout: {
                        visibility: 'none'
                    }
                }, {
                    id: 'TdtVecLabel',
                    type: 'raster',
                    source: 'TdtVecLabel',
                    minzoom: 3,
                    maxzoom: 18,
                    layout: {
                        visibility: 'none'
                    }
                }, {
                    id: 'TdtImage',
                    type: 'raster',
                    source: 'TdtImage',
                    minzoom: 3,
                    maxzoom: 18
                }, {
                    id: 'TdtImgLabel',
                    type: 'raster',
                    source: 'TdtImgLabel',
                    minzoom: 3,
                    maxzoom: 18
                }, {
                    id: "background",
                    type: "background",
                    paint: {
                        "background-color": "rgba(0, 0, 0, 0)"
                    }
                }]
            }
            map = new mapboxgl.Map({
                container: 'map',
                maxZoom: 17.3,
                minZoom: 3,
                zoom: 4,
                center: center,
                style: style,
                attributionControl: false
            })

            map.on('load', () => {
                this.addControls();
                this.addMarkerLayer();
                setTimeout(() => {
                    this.showFreeMarkers()
                }, 1000)
            })

            map.on('click', (e) => {
                let lng = e.lngLat.lng.toFixed(6)
                let lat = e.lngLat.lat.toFixed(6)
                let zoom = map.getZoom()
                console.log('点击: ' + lng + ', ' + lat + '. Zoom: ' + zoom)
            })
        },
        showFreeMarkers() {
            const arr = markers.filter(it => it.geometry.coordinates[0] > 110)
            const geojson = this.getGeojson(arr);
            map.getSource('free-markers').setData(geojson);
        },
        addControls() {
            let nav = new mapboxgl.NavigationControl()
            map.addControl(nav, 'bottom-right')
            let scale = new mapboxgl.ScaleControl({
                maxWidth: 80,
                unit: 'metric'
            });
            map.addControl(scale);
        },
        getGeojson(data) {
            return {
                type: 'FeatureCollection',
                features: data
            };
        },
        addMarkerLayer() {
            map.addSource('free-markers', {
                type: 'geojson',
                data: this.getGeojson([])
            });
            const clusterFree = {
                id: 'free-markers',
                source: 'free-markers',
                type: 'symbol',
                layout: {
                    'icon-image': [
                        'match', ['get', 'status'],
                        'OUTTIME', 'marker-grey', //#aaaaaa
                        'FINISHED', 'marker-green1', //#45e984
                        'INCOMED', 'marker-yellow1', //#ffe25e
                        'REQUIRED', 'marker-blue1', //#67a4ff
                        'marker-red1' // 无匹配值颜色#ff524fUNREQUIRED
                    ],
                    'icon-ignore-placement': true,
                    'icon-anchor': 'bottom',
                    'icon-size': [
                        'interpolate', ['linear'],
                        ['zoom'],
                        4,
                        0.6,
                        8,
                        0.8
                    ]
                }
            };
            map.addLayer(clusterFree);
            map.on('mouseenter', 'free-markers', (e) => {
                map.getCanvas().style.cursor = 'pointer';
                const feature = e.features[0];
                const prop = feature.properties;
                const coord = feature.geometry.coordinates;
                this.showPopupInfo(prop, coord);
            });
            map.on('mouseleave', 'free-markers', (e) => {
                map.getCanvas().style.cursor = '';
                this.popup.setLngLat([0, 0])
            });
        },
        showPopupInfo(prop, coord) {
            const that = this;
            let content = '';
            //{"sample_area":"重庆市市辖区万州区龙驹镇",
            // "end_time":"2020-10-31",
            // "batch_code":"PC160024927686272750"}
            // REQUIRED：已认领
            // UNREQUIRED：未认领
            // FINISHED：已完成：
            // INCOMED：已入库
            // SEND_DETECTING：送检中
            // DETECTED：已检
            prop.results = JSON.parse(prop.results);
            prop = Object.assign(prop, prop.results);
            const fieldLabel = {
                'UNREQUIRED': '所属批次,完成日期,所在行政区'.split(','),
                'FINISHED': '所属批次,提交日期,所在行政区,采集人,采集编号,农户姓名,采集地址,采集形式'.split(','),
                'REQUIRED': '所属批次,截止日期,所在行政区,采集人'.split(','),
                'INCOMED': '所属批次,采土袋ID,入库日期,所属仓库,仓库所在地,采集人,采集形式'.split(',')
            };
            const fieldCode = {
                'UNREQUIRED': 'batch_code,end_time,sample_area'.split(','),
                'FINISHED': 'batch_code,submit_time,sample_area,collector,remark,farmer,detail_address,task_attr'.split(','),
                'REQUIRED': 'batch_code,end_time,sample_area,collector'.split(','),
                'INCOMED': 'batch_code,bag_code,income_time,deport_name,deport_area,collector,task_attr'.split(',')
            };
            const fields = fieldCode[prop.status];
            for (let i = 0; i < fields.length; i++) {
                const f = fields[i];
                const l = fieldLabel[prop.status][i];
                if (prop[f]) {
                    content += `
              <li><b>${l}：</b> ${prop[f] ? prop[f] : '-'}</li>
            `;
                }
            }
            const html = `
                    <div class="popup-title" style="width:280px">
                      <label style="max-width:220px">${'坐标：' + prop.code}</label>
                      <span class="popup-close" id="popupClose">×</span>
                    </div>
                    <div class="popup-content">
                        ${content}
                    </div>`;
            that.popup.setLngLat(coord).setHTML(html).addTo(map);
            const popupClose = document.getElementById('popupClose');
            popupClose.onclick = function() {
                if (that.popup) that.popup.remove();
                map.getSource('highlight-marker').setData(getGeojson([]));
            }
        }
    }
}
</script>
<style scoped>
.map {
    width: 100%;
    height: 100%;
    position: relative;
}
</style>