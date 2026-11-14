/* =========================================================
   MutiaraLink prototype: ALL SAMPLE DATA lives in this file.
   Road names are real roads on the Mutiara Line route, but every
   closure, date, notice and ticket below is made up for the demo.
   In Part B this data would come from the database instead.
   ========================================================= */

/* The demo pretends "today" is this date, so every page agrees
   on which notices are active, upcoming or completed. */
const DEMO_TODAY = '2026-11-14';

/* ---------- Notices (used by notices.html and notice.html) ----------
   startDate / endDate use the format YYYY-MM-DD.
   priority is 'urgent' or 'normal'.
   detour is optional: only road closures have one. */
const NOTICES = [
  {
    id: 1,
    title: 'Jalan Sultan Azlan Shah closed eastbound',
    type: 'Road closure',
    area: 'Middle section',
    roads: 'Jalan Sultan Azlan Shah (eastbound, at the Jalan Tengah junction)',
    startDate: '2026-11-02',
    endDate: '2026-11-20',
    hours: 'All day',
    priority: 'urgent',
    detour: 'Detour via Jalan Tengah',
    summary: 'The eastbound side is closed for piling works. Westbound stays open.',
    details: 'The eastbound side of Jalan Sultan Azlan Shah is closed at the Jalan Tengah junction while piles for the viaduct are put in. The westbound side stays open. Buses heading east stop one block earlier, at the Jalan Tengah junction.',
    action: 'Drivers heading east should follow the detour via Jalan Tengah and allow about 10 extra minutes. Bus passengers should use the temporary stop at the Jalan Tengah junction. Homes and shops on the closed side can be reached on foot at all times.',
    updated: '2026-11-10'
  },
  {
    id: 2,
    title: 'Pedestrian crossing moved on Jalan Tengah',
    type: 'Pedestrian access',
    area: 'Middle section',
    roads: 'Jalan Tengah (near the bus stop)',
    startDate: '2026-10-26',
    endDate: '2026-11-08',
    hours: 'All day',
    priority: 'normal',
    summary: 'The zebra crossing was moved 50 m north while the footpath was rebuilt.',
    details: 'The old crossing on Jalan Tengah was closed so the footpath could be widened for a future station entrance. A temporary signalised crossing was set up 50 m north, next to the bus stop. The works are now complete and the new crossing is open.',
    action: 'Use the signalised crossing next to the bus stop. The new footpath is wider and has a ramp at both ends.',
    updated: '2026-11-09'
  },
  {
    id: 3,
    title: 'Shops on Gat Lebuh Cecil stay open',
    type: 'Business access',
    area: 'North section',
    roads: 'Gat Lebuh Cecil (rear lane entrance)',
    startDate: '2026-10-01',
    endDate: '2026-12-31',
    hours: '7am to 7pm',
    priority: 'normal',
    summary: 'Hoarding covers the shopfronts, but every shop stays open through the rear lane.',
    details: 'Site hoarding has been put up along the shopfronts on Gat Lebuh Cecil while the ground is excavated. All shops stay open as usual. Signs on the hoarding show the way to each shop, and the rear lane has been resurfaced and lit.',
    action: 'Customers should use the rear lane entrance behind the shops. Short-stay parking is at the end of the lane. Delivery vehicles can use the loading bay between 7am and 10am.',
    updated: '2026-11-01'
  },
  {
    id: 4,
    title: 'Night works on Jalan Kampung Relau',
    type: 'Construction schedule',
    area: 'South section',
    roads: 'Jalan Kampung Relau (full length)',
    startDate: '2026-11-09',
    endDate: '2026-11-20',
    hours: '9pm to 5am',
    priority: 'normal',
    summary: 'Expect noise and dust at night. Water spraying will keep the dust down.',
    details: 'Utility pipes under Jalan Kampung Relau are being moved before the viaduct columns are built. Work runs at night so the road stays open in the daytime. Noise barriers are in place, and water spraying will keep the dust down.',
    action: 'Keep windows facing Jalan Kampung Relau closed at night where you can. If noise or dust is worse than expected, report it so the site team can act on the next shift.',
    updated: '2026-11-08'
  },
  {
    id: 5,
    title: 'Temporary bus stop on Jalan Magazine',
    type: 'Public transport',
    area: 'North section',
    roads: 'Jalan Magazine (outside the market)',
    startDate: '2026-11-02',
    endDate: '2026-12-15',
    hours: 'All day',
    priority: 'normal',
    summary: 'The bus stop moves one block east until the works outside the market finish.',
    details: 'The bus stop outside the market is inside the work zone. A temporary stop with a shelter has been set up one block east. Every bus that used the old stop now stops there.',
    action: 'Board and get off at the temporary stop one block east. Allow a few extra minutes to walk from the market. Timetables are unchanged.',
    updated: '2026-11-01'
  },
  {
    id: 6,
    title: 'Jalan Tun Dr Awang closed to through traffic',
    type: 'Road closure',
    area: 'South section',
    roads: 'Jalan Tun Dr Awang (between Jalan Kampung Relau and the next junction south)',
    startDate: '2026-11-16',
    endDate: '2026-11-27',
    hours: 'All day',
    priority: 'urgent',
    detour: 'Detour via Jalan Kampung Relau',
    summary: 'Local access only for 12 days while viaduct segments are lifted into place.',
    details: 'Jalan Tun Dr Awang will be closed to through traffic so a crane can lift viaduct segments into place. Residents and shop deliveries can still enter from the Jalan Kampung Relau end. Emergency vehicles have access at all times.',
    action: 'Through traffic should use Jalan Kampung Relau. Delivery vehicles should enter from the Jalan Kampung Relau end and leave the same way. Set off early, as queues are likely in the first days.',
    updated: '2026-11-12'
  },
  {
    id: 7,
    title: 'Weekend closure of the Jalan Magazine slip road',
    type: 'Road closure',
    area: 'North section',
    roads: 'Jalan Magazine (slip road)',
    startDate: '2026-11-14',
    endDate: '2026-11-29',
    hours: 'Saturdays and Sundays, 7am to 7pm',
    priority: 'normal',
    detour: 'Detour via Gat Lebuh Cecil',
    summary: 'The slip road is closed on weekends while a crane works beside it.',
    details: 'A crane is set up beside the Jalan Magazine slip road on weekends to lift steel for the station roof. The slip road is closed while the crane works and reopens each weekday.',
    action: 'On weekends, drivers should use Gat Lebuh Cecil instead of the slip road. Pedestrians can still use the footpath on the far side.',
    updated: '2026-11-11'
  }
];

/* ---------- Closures shown on the map (map.html) ----------
   id is the number drawn on the map.
   noticeId links to the matching notice above. */
const CLOSURES = [
  {
    id: 1, noticeId: 1,
    road: 'Jalan Sultan Azlan Shah', area: 'Middle section',
    dates: '2 Nov to 20 Nov', status: 'Closed now', statusClass: 'active',
    when: 'Closed eastbound, all day, 2 Nov to 20 Nov. Westbound stays open.',
    detour: 'Use Jalan Tengah. Allow about 10 extra minutes.',
    access: 'Buses heading east stop one block earlier, at the Jalan Tengah junction. Homes and shops can be reached on foot at all times.'
  },
  {
    id: 2, noticeId: 7,
    road: 'Jalan Magazine slip road', area: 'North section',
    dates: 'Weekends, 14 Nov to 29 Nov', status: 'Closed this weekend', statusClass: 'active',
    when: 'Closed on Saturdays and Sundays, 7am to 7pm, 14 Nov to 29 Nov.',
    detour: 'Use Gat Lebuh Cecil.',
    access: 'The slip road reopens every weekday. Pedestrians can still use the footpath on the far side.'
  },
  {
    id: 3, noticeId: 6,
    road: 'Jalan Tun Dr Awang', area: 'South section',
    dates: '16 Nov to 27 Nov', status: 'Starts 16 Nov', statusClass: 'upcoming',
    when: 'Closed to through traffic all day, 16 Nov to 27 Nov.',
    detour: 'Use Jalan Kampung Relau.',
    access: 'Residents and deliveries can still enter from the Jalan Kampung Relau end. Emergency vehicles have access at all times.'
  }
];

/* ---------- Feedback tickets (track.html and dashboard.html) ----------
   dates[i] is the day the ticket reached TICKET_STEPS[i].
   Replies are listed newest first. */
const TICKET_STEPS = ['Submitted', 'Under review', 'In progress', 'Resolved'];

const TICKETS = [
  {
    id: 'MUT-0005', category: 'Safety', area: 'North section',
    where: 'Jalan Magazine, outside the market', status: 'Submitted',
    dates: ['24 Oct'], replies: []
  },
  {
    id: 'MUT-0004', category: 'Business access', area: 'North section',
    where: 'Gat Lebuh Cecil, rear lane', status: 'Under review',
    dates: ['23 Oct', '24 Oct'],
    replies: [{ date: '24 Oct', text: 'Thank you. We are checking the signs to the rear lane with the site team.' }]
  },
  {
    id: 'MUT-0003', category: 'Pedestrian access', area: 'Middle section',
    where: 'Jalan Tengah, near the bus stop', status: 'Submitted',
    dates: ['22 Oct'], replies: []
  },
  {
    id: 'MUT-0002', category: 'Noise or dust', area: 'South section',
    where: 'Jalan Kampung Relau', status: 'In progress',
    dates: ['20 Oct', '21 Oct', '22 Oct'],
    replies: [
      { date: '22 Oct', text: 'Water spraying will start on the next night shift. We will update this ticket when it is done.' },
      { date: '21 Oct', text: 'Thank you. We have passed this to the site supervisor.' }
    ]
  },
  {
    id: 'MUT-0001', category: 'Road closure', area: 'Middle section',
    where: 'Jalan Sultan Azlan Shah', status: 'Resolved',
    dates: ['18 Oct', '18 Oct', '19 Oct', '21 Oct'],
    replies: [
      { date: '21 Oct', text: 'The missing detour sign has been put back at the Jalan Tengah junction.' },
      { date: '18 Oct', text: 'Thank you. We will check the detour signs today.' }
    ]
  }
];

/* The ticket number a new report from feedback.html receives. */
const NEW_TICKET_ID = 'MUT-0006';
