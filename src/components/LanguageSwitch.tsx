'use client';

import React, { useEffect, useState } from 'react';
import { Dropdown, Button, Space } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setLanguage } from '@/store/personSlice';

const LanguageSwitch: React.FC = () => {
  const dispatch = useDispatch();
  const { language } = useSelector((state: RootState) => state.person);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (lang: 'th' | 'en') => {
    dispatch(setLanguage(lang));
  };

  const items = [
    {
      key: 'th',
      label: 'ไทย',
      onClick: () => handleLanguageChange('th'),
    },
    {
      key: 'en',
      label: 'English',
      onClick: () => handleLanguageChange('en'),
    },
  ];

  return (
    <Dropdown
      menu={{ items }}
      placement="bottomRight"
      trigger={['click']}
    >
      <Button type="text" icon={<GlobalOutlined />}>
        <Space>
          {mounted ? (language === 'th' ? 'ไทย' : 'English') : 'ไทย'}
        </Space>
      </Button>
    </Dropdown>
  );
};

export default LanguageSwitch;
