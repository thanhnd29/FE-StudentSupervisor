import { dashboardApi } from '@/core/api/dashboard.api';
import { highSchoolApi } from '@/core/api/high-school.api';
import { schoolYearApi } from '@/core/api/school-years.api';
import { FieldType } from '@/core/components/field/FieldDisplay';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import NKFormWrapper from '@/core/components/form/NKFormWrapper';
import TableBuilder from '@/core/components/table/TableBuilder';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { MonthList, WeekList } from '@/core/models/date';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import Joi from 'joi';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface PageProps { }

const Page: React.FunctionComponent<PageProps> = () => {
  const router = useNKRouter();
  const queryClient = useQueryClient();

  const today = new Date()

  const [year, setYear] = useState<number>(Number(today.getFullYear()))
  const [month, setMonth] = useState<number>(0)
  const [week, setWeek] = useState<number>(0)

  const { isAdmin, isPrincipal, isSchoolAdmin, isSupervisor, isStudentSupervisor, isTeacher, schoolId, userId } = useSelector<RootState, UserState>(
    (state: RootState) => state.user,
  );

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ['violation-in-week'],
    });
  }, [year, month, week, queryClient]);

  useDocumentTitle('Danh sách vi phạm trong năm');

  return (
    <div className="">
      <TableBuilder
        sourceKey="violation-in-week"
        title="Danh sách vi phạm trong năm"
        columns={[
          {
            key: 'violationId',
            title: 'ID',
            type: FieldType.TEXT,
          },
          {
            key: 'studentCode',
            title: 'Mã học sinh',
            type: FieldType.TEXT,
          },
          {
            key: 'studentName',
            title: 'Tên học sinh',
            type: FieldType.TEXT,
          },
          {
            key: 'violationName',
            title: 'Tên vi phạm',
            type: FieldType.TEXT,
          },
          {
            key: 'date',
            title: 'Ngày vi phạm',
            type: FieldType.TIME_DATE,
          },
          {
            key: 'violationGroupName',
            title: 'Nhóm vi phạm',
            type: FieldType.TEXT,
          },
          {
            key: 'year',
            title: 'Niên khóa',
            type: FieldType.TEXT,
          },
        ]}
        queryApi={() => dashboardApi.getByMonthAndWeek(schoolId, year, month, week)}
        extraButtons={
          <div className="flex flex-row items-center w-full">
            <FormBuilder
              title=""
              apiAction={() => { }}
              defaultValues={{
                year: year,
                month: month,
                weekNumber: week ?? 0,
                school: schoolId
              }}
              schema={{
                year: Joi.number(),
                month: Joi.number(),
                weekNumber: Joi.number(),
                school: Joi.number()
              }}
              isButton={false}
              className="flex items-center w-[40rem] !bg-transparent"
              fields={[
                {
                  name: 'school',
                  label: '',
                  type: NKFormType.SELECT_API_OPTION,
                  fieldProps: {
                    apiAction: (value) => (
                      highSchoolApi.getEnumSelectOptions(value)
                    ),
                    disabled: true,
                  },
                  span: 1,
                },
                {
                  name: 'year',
                  label: '',
                  type: NKFormType.SELECT_API_OPTION,
                  fieldProps: {
                    apiAction: (value) => (
                      schoolYearApi.getEnumSelectYear({ search: value, highSchoolId: schoolId })
                    )
                  },
                  span: 1,
                  onChangeExtra: (value) => {
                    setYear(Number(value))
                  }
                },
                {
                  name: 'month',
                  label: '',
                  type: NKFormType.SELECT_API_OPTION,
                  fieldProps: {
                    apiAction: async (value) => (
                      await MonthList.filter((item) => item.name.toLowerCase().includes(value.toLowerCase()))
                    )
                  },
                  span: 1,
                  onChangeExtra: (value) => {
                    setMonth(Number(value))
                  }
                },
                {
                  name: 'weekNumber',
                  label: '',
                  type: NKFormType.SELECT_API_OPTION,
                  fieldProps: {
                    apiAction: async (value) => (
                      await WeekList.filter((item) => item.name.toLowerCase().includes(value.toLowerCase()))
                    ),
                  },
                  span: 1,
                  onChangeExtra: (value) => {
                    setWeek(Number(value))
                  }
                },
              ]}
            />
          </div>
        }
      />
    </div>
  );
};

export const Route = createFileRoute('/_admin-layout/dashboard/violation-tops/violation-in-week')({
  component: Page,
})