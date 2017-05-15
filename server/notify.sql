CREATE OR REPLACE FUNCTION packet_update_notify() RETURNS trigger AS $$
DECLARE
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM pg_notify('packet_update', json_build_object('new_val', row_to_json(NEW))::text);
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER packet_notify_insert ON packet;
CREATE TRIGGER packet_notify_insert AFTER INSERT ON packet FOR EACH ROW EXECUTE PROCEDURE packet_update_notify();
