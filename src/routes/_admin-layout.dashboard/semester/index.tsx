import { schoolYearApi } from '@/core/api/school-years.api';
import { semesterApi } from '@/core/api/semester.api';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import ModalBuilder from '@/core/components/modal/ModalBuilder';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { NKConstant } from '@/core/NKConstant';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';
import { toastError } from '@/core/utils/api.helper';
import { EditOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import Joi from 'joi';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface PageProps { }

const Page: React.FunctionComponent<PageProps> = () => {
  const router = useNKRouter();
  const queryClient = useQueryClient();
  const { isAdmin, isPrincipal, isSchoolAdmin, isSupervisor, isStudentSupervisor, isTeacher, schoolId } = useSelector<RootState, UserState>(
    (state: RootState) => state.user,
  );

  useDocumentTitle('Danh Sách Học Kỳ');

  return (
    <div>
      <div className="">
        <TableBuilder
          sourceKey="semester"
          title="Danh sách Học Kỳ"
          columns={[
            {
              key: 'semesterId',
              title: 'ID',
              type: FieldType.TEXT,
              width: '50px'
            },
            {
              key: 'schoolYearId',
              title: 'Niên khóa',
              type: FieldType.BADGE_API,
              apiAction(value) {
                return schoolYearApi.getEnumSelectOptions({
                  search: value,
                  withSchoolName: true,
                });
              },
            },
            {
              key: 'name',
              title: 'Tên',
              type: FieldType.TEXT,
            },
            {
              key: 'startDate',
              title: 'Ngày bắt đầu',
              type: FieldType.TIME_DATE,
            },
            {
              key: 'endDate',
              title: 'Ngày kết thúc',
              type: FieldType.TIME_DATE,
            },
          ]}
          isSelectYear={true}
          schoolId={schoolId}
          queryApi={schoolId ? () => semesterApi.getBySchool(schoolId) : semesterApi.getAll}
          actionColumns={(record) => {
            return (
              <div className="flex flex-col gap-2">
                <ModalBuilder
                  btnLabel=""
                  btnProps={{
                    size: 'small',
                    icon: <EditOutlined />,
                  }}
                  title="Edit School Year"
                >
                  {(close) => {
                    return (
                      <FormBuilder
                        className="!p-0"
                        title=""
                        apiAction={(dto) => {
                          if (moment(dto.startDate).isAfter(dto.endDate)) {
                            toast.error('Start Date must be before end date');
                            return;
                          }

                          return semesterApi.update(record.semesterId, {
                            ...dto,
                            endDate: moment(dto.endDate).toISOString(),
                            startDate: moment(dto.startDate).toISOString(),
                          });
                        }}
                        defaultValues={{
                          endDate: new Date(record.endDate),
                          startDate: new Date(record.startDate),
                          name: record.name
                        }}
                        schema={{
                          endDate: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                          startDate: Joi.date().required().messages(NKConstant.MESSAGE_FORMAT),
                          name: Joi.string().required().messages(NKConstant.MESSAGE_FORMAT),
                        }}
                        fields={[
                          {
                            name: 'endDate',
                            label: 'End Date',
                            type: NKFormType.DATE,
                          },
                          {
                            name: 'startDate',
                            label: 'Start Date',
                            type: NKFormType.DATE,
                          },
                        ]}
                        onExtraSuccessAction={(data) => {
                          queryClient.invalidateQueries({
                            queryKey: ['semester'],
                          });

                          close();

                          toast.success(data.message || 'Successful');
                        }}
                        onExtraErrorAction={toastError}
                      />
                    );
                  }}
                </ModalBuilder>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export const Route = createFileRoute('/_admin-layout/dashboard/semester/')({
  component: Page,
})