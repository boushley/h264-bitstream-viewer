/**
 * Calculates the dimensions of a frame in pixels based on the SPS data.
 * @param {object} sps - The Sequence Parameter Set object.
 * @returns {{width: number, height: number, widthInMbs: number, heightInMbs: number} | null}
 */
export function getFrameDimensions(sps) {
  if (!sps) {
    return null;
  }

  const widthInMbs = sps.pic_width_in_mbs_minus1 + 1;
  const width = widthInMbs * 16;

  const heightInMapUnits = sps.pic_height_in_map_units_minus1 + 1;
  // frame_mbs_only_flag is 1 for progressive, 0 for interlaced.
  // (2 - 1) = 1 for progressive
  // (2 - 0) = 2 for interlaced
  const heightInMbs = heightInMapUnits * (2 - sps.frame_mbs_only_flag);
  const height = heightInMbs * 16;

  return {
    width,
    height,
    widthInMbs,
    heightInMbs,
  };
}