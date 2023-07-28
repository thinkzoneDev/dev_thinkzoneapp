import React from 'react';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const FlnScreenSkeleton = props => {
  return (
    <SkeletonPlaceholder>
      <SkeletonPlaceholder.Item alignItems="center" justifyContent="center">
        <SkeletonPlaceholder.Item marginTop={10} marginBottom={20}>
          <SkeletonPlaceholder.Item
            width={250}
            height={20}
            borderRadius={4}
            marginBottom={15}
            marginLeft={25}
          />
          <SkeletonPlaceholder.Item
            justifyContent="space-evenly"
            alignItems="center"
            flexDirection="row"
            width="100%">
            <SkeletonPlaceholder.Item
              width={100}
              height={100}
              borderRadius={10}
            />
            <SkeletonPlaceholder.Item
              width={100}
              height={100}
              borderRadius={10}
            />
            <SkeletonPlaceholder.Item
              width={100}
              height={100}
              borderRadius={10}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
        {/* */}

        {/* */}
        <SkeletonPlaceholder.Item
          flexDirection="row"
          alignItems="center"
          marginTop={10}></SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          flexDirection="row"
          alignItems="center"
          marginTop={10}>
          <SkeletonPlaceholder.Item width={80} height={80} borderRadius={10} />
          <SkeletonPlaceholder.Item marginLeft={20}>
            <SkeletonPlaceholder.Item
              width={150}
              height={30}
              borderRadius={4}
            />
            <SkeletonPlaceholder.Item
              marginTop={6}
              width={250}
              height={20}
              borderRadius={4}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          flexDirection="row"
          alignItems="center"
          marginTop={10}
          marginBottom={10}>
          <SkeletonPlaceholder.Item width={80} height={80} borderRadius={10} />
          <SkeletonPlaceholder.Item marginLeft={20}>
            <SkeletonPlaceholder.Item
              width={150}
              height={30}
              borderRadius={4}
            />
            <SkeletonPlaceholder.Item
              marginTop={6}
              width={250}
              height={20}
              borderRadius={4}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          flexDirection="row"
          alignItems="center"
          marginTop={10}
          marginBottom={10}>
          <SkeletonPlaceholder.Item width={80} height={80} borderRadius={10} />
          <SkeletonPlaceholder.Item marginLeft={20}>
            <SkeletonPlaceholder.Item
              width={150}
              height={30}
              borderRadius={4}
            />
            <SkeletonPlaceholder.Item
              marginTop={6}
              width={250}
              height={20}
              borderRadius={4}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          flexDirection="row"
          alignItems="center"
          marginTop={10}
          marginBottom={10}>
          <SkeletonPlaceholder.Item width={80} height={80} borderRadius={10} />
          <SkeletonPlaceholder.Item marginLeft={20}>
            <SkeletonPlaceholder.Item
              width={150}
              height={30}
              borderRadius={4}
            />
            <SkeletonPlaceholder.Item
              marginTop={6}
              width={250}
              height={20}
              borderRadius={4}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          flexDirection="row"
          alignItems="center"
          marginTop={10}
          marginBottom={10}>
          <SkeletonPlaceholder.Item width={80} height={80} borderRadius={10} />
          <SkeletonPlaceholder.Item marginLeft={20}>
            <SkeletonPlaceholder.Item
              width={150}
              height={30}
              borderRadius={4}
            />
            <SkeletonPlaceholder.Item
              marginTop={6}
              width={250}
              height={20}
              borderRadius={4}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default FlnScreenSkeleton;
