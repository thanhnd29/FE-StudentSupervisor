import { createFileRoute } from '@tanstack/react-router';

const Dashboard = () => {
    return <div className="grid grid-cols-2 gap-10"></div>;
};

export const Route = createFileRoute('/_admin-layout/dashboard/')({
    component: Dashboard,
});
