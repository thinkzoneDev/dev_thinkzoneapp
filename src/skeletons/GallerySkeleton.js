import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const GallerySkeleton = () => {
  return (
    <SkeletonPlaceholder>
      {/* for time spent */}

      <SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          width={370}
          height={100}
          marginTop={12}
          marginLeft={12}
          borderRadius={12}
        />

        <SkeletonPlaceholder.Item
          width={370}
          height={100}
          marginTop={12}
          marginLeft={12}
          borderRadius={12}
        />

        <SkeletonPlaceholder.Item
          width={370}
          height={100}
          marginTop={12}
          marginLeft={12}
          borderRadius={12}
        />

        <SkeletonPlaceholder.Item
          width={370}
          height={100}
          marginTop={12}
          marginLeft={12}
          borderRadius={12}
        />

        <SkeletonPlaceholder.Item
          width={370}
          height={100}
          marginTop={12}
          marginLeft={12}
          borderRadius={12}
        />
        <SkeletonPlaceholder.Item
          width={370}
          height={100}
          marginTop={12}
          marginLeft={12}
          borderRadius={12}
        />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default GallerySkeleton;
