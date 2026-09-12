import json
import time
import queue
import threading

class AuctionBroadcaster:
    def __init__(self):
        self._listeners = {}
        self._lock = threading.Lock()

    def subscribe(self, auction_id):
        """
        Creates a new Queue for a client connected to an auction's live stream.
        """
        q = queue.Queue(maxsize=50)
        with self._lock:
            if auction_id not in self._listeners:
                self._listeners[auction_id] = []
            self._listeners[auction_id].append(q)
        return q

    def unsubscribe(self, auction_id, q):
        """
        Removes a client's Queue when their connection closes.
        """
        with self._lock:
            if auction_id in self._listeners:
                try:
                    self._listeners[auction_id].remove(q)
                    if not self._listeners[auction_id]:
                        del self._listeners[auction_id]
                except ValueError:
                    pass

    def broadcast_bid(self, auction_id, event_data):
        """
        Broadcasts a new bid event to all clients actively viewing this auction.
        """
        message = json.dumps(event_data)
        with self._lock:
            queues = list(self._listeners.get(auction_id, []))

        for q in queues:
            try:
                q.put_nowait(message)
            except queue.Full:
                pass

broadcaster = AuctionBroadcaster()
