import React from 'react';
import * as window from '../utils/dimensions';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const PgeContentSkeleton = props => {
  return (
    <SkeletonPlaceholder>
      <SkeletonPlaceholder.Item
        marginTop={20}
        marginBottom={20}
        width={window.WindowWidth * 0.9}
        height={'100%'}></SkeletonPlaceholder.Item>
      <SkeletonPlaceholder.Item
        marginTop={-50}
        marginBottom={20}
        width={window.WindowWidth * 0.9}
        height={89}></SkeletonPlaceholder.Item>

      {/* 
        <SkeletonPlaceholder.Item
          marginTop={20}
          marginBottom={20}
          width={window.WindowWidth * 0.9}
          height={89}></SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          marginTop={20}
          marginBottom={20}
          width={window.WindowWidth * 0.9}
          height={89}></SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          marginTop={20}
          marginBottom={20}
          width={window.WindowWidth * 0.9}
          height={89}></SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          marginTop={20}
          marginBottom={20}
          width={window.WindowWidth * 0.9}
          height={89}></SkeletonPlaceholder.Item> */}
    </SkeletonPlaceholder>
  );
};

export default PgeContentSkeleton;
