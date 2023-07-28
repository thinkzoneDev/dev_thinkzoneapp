import React from 'react';
import {Modalize} from 'react-native-modalize';

const BottomSheet = ({modalRef, children, modalHeight}) => {
  return (
    <>
      <Modalize ref={modalRef} modalHeight={modalHeight}>
        {children}
      </Modalize>
    </>
  );
};

export default BottomSheet;
