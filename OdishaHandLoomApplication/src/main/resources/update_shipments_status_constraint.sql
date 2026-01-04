-- Drop the existing check constraint
ALTER TABLE shipments DROP CONSTRAINT IF EXISTS shipments_status_check;

-- Re-create the check constraint with all allowed enum values
ALTER TABLE shipments
ADD CONSTRAINT shipments_status_check 
CHECK (status IN (
    'CREATED',
    'ASSIGNED',
    'PACKED',
    'READY_TO_SHIP',
    'DISPATCHED',
    'IN_TRANSIT',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'DELIVERY_FAILED',
    'RTO_INITIATED',
    'RTO_COMPLETED',
    'RETURN_REQUESTED',
    'RETURN_APPROVED',
    'PICKUP_INITIATED',
    'PICKUP_COMPLETED',
    'RETURN_IN_TRANSIT',
    'RETURN_DELIVERED',
    'REFUND_PROCESSED',
    'COD_PENDING',
    'COD_COLLECTED',
    'COD_SETTLED'
));
