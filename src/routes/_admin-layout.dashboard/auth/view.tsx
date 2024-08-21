import FieldBuilder from '@/core/components/field/FieldBuilder';
import { FieldType } from '@/core/components/field/FieldDisplay';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';
import { createFileRoute } from '@tanstack/react-router';
import { useSelector } from 'react-redux';

const Page = () => {
    const { schoolName, code, name, phone, password, address, userId, schoolId } = useSelector<RootState, UserState>(
        (state: RootState) => state.user,
    );

    const record = { schoolName, code, name, phone, password, address, userId, schoolId }

    return (
        <div>
            <FieldBuilder
                title="Thông tin cá nhân"
                record={record}
                isPadding={false}
                fields={[
                    {
                        key: 'userId',
                        title: 'ID',
                        type: FieldType.TEXT,
                    },
                    {
                        key: 'code',
                        title: 'Mã người dùng',
                        type: FieldType.TEXT,
                    },
                    {
                        key: 'name',
                        title: 'Tên người dùng',
                        type: FieldType.TEXT,
                    },
                    {
                        key: 'phone',
                        title: 'Số điện thoại',
                        type: FieldType.TEXT,
                    },
                    {
                        key: 'password',
                        title: 'Mật khẩu',
                        type: FieldType.TEXT,
                    },
                    {
                        key: 'address',
                        title: 'Địa chỉ',
                        type: FieldType.TEXT,
                    },
                    {
                        key: 'schoolName',
                        title: 'Trường',
                        type: FieldType.TEXT,
                    },
                ]}
            />
        </div>
    );
};

export const Route = createFileRoute('/_admin-layout/dashboard/auth/view')({
    component: Page,
});
