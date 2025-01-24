import { Spin } from 'antd';

const Loading = () => {
  return (
    <div style={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh'
    }}>
      {/* Removed tip prop as it only works in nest/fullscreen patterns */}
      <Spin size="large" />
    </div>
  );
};

export default Loading;
