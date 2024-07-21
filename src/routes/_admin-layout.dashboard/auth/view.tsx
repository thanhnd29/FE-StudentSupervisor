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
                title="Profile"
                record={record}
                isPadding={false}
                fields={[
                    {
                        key: 'userId',
                        title: 'ID',
                        type: FieldType.TEXT,
                    },
                    {
                        key: 'name',
                        title: 'Name',
                        type: FieldType.TEXT,
                    },
                    {
                        key: 'password',
                        title: 'Password',
                        type: FieldType.TEXT,
                    },
                    {
                        key: 'phone',
                        title: 'Phone',
                        type: FieldType.TEXT,
                    },
                    {
                        key: 'schoolName',
                        title: 'School Name',
                        type: FieldType.TEXT,
                    },
                    {
                        key: 'code',
                        title: 'Code',
                        type: FieldType.TEXT,
                    },
                    {
                        key: 'address',
                        title: 'Address',
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
