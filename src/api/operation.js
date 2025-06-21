import _axios from '@/utils/_axios';

export const combineRGB = (redBondId, greenBondId, blueBondId, stretchMode) => {
    return _axios.get("/operation/combineRGB", {
        params: {
            redBondId,
            greenBondId,
            blueBondId,
            stretchMode
        }
    })
}
<<<<<<< HEAD
// // NDVI 植被指数计算
export function computeNDVI(redBandId,nirBandId) {
      return _axios.get("/operation/ndvi", {
       params: {
            redBandId,
            nirBandId,
        }
    })
}

export const cropTiff = (id, x1, y1, x2, y2) => {
    return _axios.post('/operation/crop-tiff', null, {
        params: { id, x1, y1, x2, y2 }
    });
};


>>>>>>> debecef (crop)
