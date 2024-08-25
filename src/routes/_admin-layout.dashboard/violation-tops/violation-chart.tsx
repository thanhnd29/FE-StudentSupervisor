import { Chart, dashboardApi } from '@/core/api/dashboard.api';
import { schoolYearApi } from '@/core/api/school-years.api';
import ChartBasicLine from '@/core/components/chart/ChartBasicLine';
import ChartLabel from '@/core/components/chart/ChartLabel';
import NKChartLabel from '@/core/components/chart/NKChartLabel';
import FormBuilder from '@/core/components/form/FormBuilder';
import { NKFormType } from '@/core/components/form/NKForm';
import { useDocumentTitle } from '@/core/hooks/useDocumentTitle';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState } from '@/core/store';
import { UserState } from '@/core/store/user';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import Joi from 'joi';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface PageProps { }

const Page: React.FunctionComponent<PageProps> = () => {
  const router = useNKRouter();
  const queryClient = useQueryClient();

  const today = new Date();
  const [yearT, setYearT] = useState<number>(today.getFullYear());
  const [data, setData] = useState<Chart | null>(null);

  const { isAdmin, isPrincipal, isSchoolAdmin, isSupervisor, isStudentSupervisor, isTeacher, schoolId, userId } = useSelector<RootState, UserState>(
    (state: RootState) => state.user,
  );

  useDocumentTitle('Biểu đồ vi phạm');

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const dataChart = await dashboardApi.getViolationChart(schoolId, yearT);
        setData(dataChart);
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
      }
    };

    fetchChart();
  }, [yearT, schoolId]);

  if (!data) return null;

  return (
    <div className="flex flex-col gap-5">
      <FormBuilder
        title="Biểu đồ vi phạm"
        apiAction={() => { }}
        fields={[
          {
            name: 'year',
            label: '',
            type: NKFormType.SELECT_API_OPTION,
            fieldProps: {
              apiAction: (value) => (
                schoolYearApi.getEnumSelectYear({ search: value, highSchoolId: schoolId })
              ),
            },
            span: 1,
            onChangeExtra: (value) => {
              setYearT(Number(value));
            },
          },
        ]}
        defaultValues={{
          year: yearT,
        }}
        schema={{
          year: Joi.number(),
        }}
        isButton={false}
      />
      <NKChartLabel
        label="Total Violations"
        value={data.values.reduce((acc, item) => acc + item.data, 0)}
        color="white"
        prefix={
          <ChartBasicLine
            title={data.title}
            values={data.values}
            unit={data.unit}
          />
        }
      />
    </div>
  );
};

export const Route = createFileRoute('/_admin-layout/dashboard/violation-tops/violation-chart')({
  component: Page,
});
