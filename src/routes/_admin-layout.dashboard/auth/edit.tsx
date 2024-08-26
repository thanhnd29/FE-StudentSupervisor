import { createFileRoute } from '@tanstack/react-router'
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';
import { useSelector } from 'react-redux';
import FormBuilder from '@/core/components/form/FormBuilder';
import { IUpdateAuthDto, userApi } from '@/core/api/user.api';
import { NKFormType } from '@/core/components/form/NKForm';
import Joi from 'joi';
import { toastError } from '@/core/utils/api.helper';
import { queryClient } from '@/core/common/configGlobal';
import { toast } from 'react-toastify';
import { NKConstant } from '@/core/NKConstant';

const Page = () => {
  const { name, phone, password, address, userId, schoolId, code, isAdmin } = useSelector<RootState, UserState>(
    (state: RootState) => state.user,
  );

  const record = { name, phone, password, address, userId, schoolId, code }

  return (
    <div>
      <FormBuilder<IUpdateAuthDto>
        apiAction={(dto) => userApi.update(record.userId.toString(), {
          schoolId: record.schoolId,
          code: record.code,
          ...dto
        })}
        defaultValues={{
          name: record.name,
          phone: record.phone,
          address: record.address,
          password: record.password,
        }}
        fields={[
          {
            name: 'name',
            label: 'Tên',
            type: NKFormType.TEXT,
          },
          {
            name: 'phone',
            label: 'Số điện thoại',
            type: NKFormType.TEXT,
          },
          {
            name: 'address',
            label: 'Địa chỉ',
            type: NKFormType.TEXT,
          },
          {
            name: 'password',
            label: 'Mật khẩu',
            type: NKFormType.PASSWORD,
          },
        ]}
        title="Cập nhật hồ sơ"
        schema={{
          name: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
          phone: Joi.string().required().length(9).messages(NKConstant.MESSAGE_FORMAT),
          address: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
          password: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
        }}
        onExtraErrorAction={toastError}
        onExtraSuccessAction={(data) => {
          queryClient.invalidateQueries({
            queryKey: ['account'],
          });
          
          toast.success(data.message || "successful");
        }}
        isButton={!isAdmin}
      />
    </div>
  );
};

export const Route = createFileRoute('/_admin-layout/dashboard/auth/edit')({
  component: Page,
})